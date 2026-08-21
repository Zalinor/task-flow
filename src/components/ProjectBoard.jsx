import { useEffect, useState } from 'react';
import { USERS, getUserById } from '../users';
import AssigneeFilterButton from './AssigneeFilterButton';
import Column from './Column';
import EmptyState from './EmptyState'
import TaskModal from './TaskModal';
import TaskDetailModal from './TaskDetailModal';
import FilterPanel from './FilterPanel';
import {getDisplayPriority} from "../utils/task"
import ConfirmDialog from './ConfirmDialog';
import Report from './Report';

import { unionIco, shareIco, ellipsisIco, userFilter, filter, selectIco } from '../icons';
import '../App.css';


const PROJECT_DESCRIPTION = "info about project.";
const PROJECT_ATTACHMENTS = [
  {name: "Client_Proporsal.xls", meta: "Today - 4 MB"},
  {name: "PRD.docx", meta: "Yesterday - Google Docs"},
];


function ProjectBoard({projectId, projectName, activeUserId}) {

    const [columns, setColumns] = useState(() => {
        const saved = localStorage.getItem(`project-${projectId}-columns`);
        return saved ? JSON.parse(saved) : [
            {id: "todo", title: "To Do"},
            {id: "in-progress", title: "In Progress"},
            {id: "done", title: "Done", isFinal: true},
    ];
  });
    

  const handleSetFinalColumn = (columnId) => {
    setColumns((prevColumns) => 
      prevColumns.map((column) => ({
        ...column,
        isFinal: column.id === columnId ? !column.isFinal : false,
      }))
    );
  }

  const finalColumnId = columns.find((c) => c.isFinal)?.id
    ?? columns.find((c) => c.id === "done")?.id
    ?? null;

  //Persist columns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`project-${projectId}-columns`, JSON.stringify(columns));
  }, [columns, projectId]);

  const handleRenameColumn = (columnId, newTitle) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? {...column, title: newTitle} : column
      )
    )
  };

  const handleSetColumnColor = (columnId, color) => {
    setColumns(
      columns.map((column) => 
      column.id === columnId ? {...column, color} : column
      ) 
    );
  }

  const handleAddColumn = () => {
    const newColumn = {
      id: crypto.randomUUID(),
      title: "New Column",
    };
    setColumns([...columns, newColumn]);
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    setTasks(tasks.filter((task) => task.columnId !== columnId));
  };
  // Single source of truth: tasks live here, regardless of status
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`project-${projectId}-tasks`);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");

  // Persist task to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`project-${projectId}-tasks`, JSON.stringify(tasks));
  }, [tasks]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueDateSort, setDueDateSort] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState([]);

  const hasActiveFilters = statusFilter !== "All" || priorityFilter !== "All" || dueDateSort !== null || assigneeFilter.length > 0;
  const handleClearFilters = () => {
    setStatusFilter("All");
    setPriorityFilter("All");
    setDueDateSort(null);
    setAssigneeFilter([]);
  };

  const taskMatchesFilters = (task) => {
    if (statusFilter !== "All" && task.status !== statusFilter) {
      return false;
    }
    if (priorityFilter !== "All" && getDisplayPriority(task) !== priorityFilter) {
      return false;
    }
    if (assigneeFilter.length > 0) {
      const assignees = task.assignedTo ?? [];
      const matchesUnassigned = assigneeFilter.includes("unassigned") && assignees.length === 0;
      const matchesUser = assignees.some((userId) => assigneeFilter.includes(userId));
      if (!matchesUnassigned && !matchesUser) return false;
    }
    return true;
  };

  const filteredTasks = tasks.filter(taskMatchesFilters);

  const displayTasks = dueDateSort
    ? [...filteredTasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return dueDateSort === "asc"
      ? a.dueDate.localeCompare(b.dueDate)
      : b.dueDate.localeCompare(a.dueDate);
    })
    : [...filteredTasks].sort((a,b) => a.order - b.order);

    const [addTaskContext, setAddTaskContext] = useState(null);

  // Creates a new task and adds it to the list, always starting as "todo"
  const handleAddTask = (taskData) => {
    let targetColumnId = taskData.columnId;

    if (columns.length === 0) {
      const defaultColumn = {id:"todo", title: "To Do"};
      setColumns([defaultColumn]);
      targetColumnId = defaultColumn.id;
    }

    const newTask = {
      id: Date.now(),
      order: tasks.length,
      ...taskData,
      columnId: targetColumnId,
    };
    setTasks([...tasks, newTask]);
    setAddTaskContext(null);
  };

  // Removes a task by id
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const moveTaskToColumn = (task, newColumnId) => {
    const isMovingToFinal = finalColumnId !== null && newColumnId === finalColumnId;
    return {
      ...task,
      columnId: newColumnId,
      status: isMovingToFinal ? "Completed" : task.status,
    };
  };

  const handleMoveTask = (taskId, newColumnId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? moveTaskToColumn(task, newColumnId) : task)));
  };

  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());

  const handleToggleSelectMode = () => {
    setIsSelectMode((prev) => !prev);
    setSelectedTaskIds(new Set());
 };

 const handleToggleTaskSelection = (taskId) => {
  setSelectedTaskIds((prev) => {
    const next = new Set(prev);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    return next;
  });
 };

 const handleDeleteSelected = () => {
  setTasks((prevTasks) => prevTasks.filter((task) => !selectedTaskIds.has(task.id)));
  setSelectedTaskIds(new Set());
  setIsSelectMode(false);
 };

 const handleMoveSeleted = (targetColumnId) => {
  setTasks((prevTasks) =>
  prevTasks.map((task) => (selectedTaskIds.has(task.id) ? moveTaskToColumn(task, targetColumnId) : task))
  );
  setSelectedTaskIds(new Set());
  setIsSelectMode(false);
 };

// Updates a task's text after inline editing finishes 
  const handleEdit = (id, newText) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? {...task, text: newText } : task
        )
      );
    };
  
    //Reordering: moves the dragged task to sit right before the target task,
    // then recalculates "order" for every task based on the new array position
  const handleReorder = (draggedId, targetId) => {
    setTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex((task) => task.id === draggedId);
      if (draggedIndex === -1) return prevTasks;
      // const targetIndex = prevTasks.findIndex((task) => task.id === targetId);
      if (draggedIndex === -1) return prevTasks;

      const updated = [...prevTasks];
      const [draggedTask] = updated.splice(draggedIndex, 1);

      if (targetId === null) {
        updated.push(draggedTask);
      } else {
        const newTargetIndex = updated.findIndex((task) => task.id === targetId);
        if (newTargetIndex === -1) return prevTasks;
        updated.splice(newTargetIndex, 0, draggedTask);
      }

      // reassign order to match the new array positions, avoiding any duplicate value
      return updated.map((task, index) => ({...task, order: index}));
    });
  };
  const [draggedColumnId, setDraggedColumnId] = useState(null);

  const handleReorderColumns = (draggedId, targetColumnId, side) => {
    setColumns((prevColumns) => {
      const draggedIndex = prevColumns.findIndex((col) => col.id === draggedId);
      if (draggedIndex === -1) return prevColumns;

      const updated = [...prevColumns];
      const [draggedColumn] = updated.splice(draggedIndex, 1);

      const targetIndex = updated.findIndex((col) => col.id === targetColumnId);
      if (targetIndex === -1) {
        updated.push(draggedColumn);
      } else {
        const insertIndex = side === "after" ? targetIndex + 1 : targetIndex;
        updated.splice(insertIndex, 0, draggedColumn);
      }
      return updated;
    });
    setDraggedColumnId(null);
  };

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Task editing
  const [editingTaskId, setEditingTaskId] = useState(null);

  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;

  const handleEditTaskRequest = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleUpdateTask = (taskData) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskData.id 
        ? {...task, ...taskData, updatedAt: new Date().toISOString()}
        : task
      )
    );
    setEditingTaskId(null);
  };

  const handleAddComment = (taskId, text) => {
    const author = getUserById(activeUserId);
    const newComment = {
      id: crypto.randomUUID(),
      author: author?.name ?? "Unknown",
      text,
      createdAt: new Date().toISOString(),
    };
    setTasks(
      tasks.map((task) => 
        task.id === taskId
        ? {...task, comments: [...(task.comments ?? []), newComment], updatedAt: new Date().toISOString()}
        : task
      )
    );
  };

  const handleToggleAssigneeFilter = (value) => {
    setAssigneeFilter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  const handleClearAssigneeFilter = () => {
    setAssigneeFilter([]);
  };

  const [activeTab, setActiveTab] = useState("tasks");

  const [columnPendingDeletionId, setColumnPendingDeletionId] = useState(null);

  const handleRequestDeleteColumn = (columnId) => {
    setColumnPendingDeletionId(columnId);
  }

  const handleConfirmDeleteColumn = () => {
    handleDeleteColumn(columnPendingDeletionId);
    setColumnPendingDeletionId(null);
  }

  const handleCancelDeleteColumn = () => {
    setColumnPendingDeletionId(null);
  };

  const columnToDelete = columns.find((column) => column.id === columnPendingDeletionId) ?? null;

  return (
    <div className="project-board">
    <div className="project-header">
      <h1>{projectName}</h1>
      <div className="project-header-actions">
        <button type="button" className="icon-button">{shareIco}</button>
        <button type="button" className="icon-button">{ellipsisIco}</button>
      </div>
    </div>

    <div className="project-tabs">
      <button
        type="button"
        className={`project-tab ${activeTab === "tasks" ? "active" : ""}`}
        onClick={() => setActiveTab("tasks")}
      >
        Tasks
      </button>
      <button
      type="button"
        className={`project-tab ${activeTab === "report" ? "active" : ""}`}
        onClick={() => setActiveTab("report")}
      >
        Report
      </button>
    </div>
    {activeTab === "tasks" ? (
      <>
        <div className="project-row">
        <div className="task-input-row">
          <button 
            className="task-button"
            onClick={() => setAddTaskContext({columnId: null})}>
              {unionIco}
              Add Task
            </button>
            <button 
              type="button"
              className={`select-button ${isSelectMode ? "active" : ""}`}
              onClick={handleToggleSelectMode}
            >
              {selectIco} {isSelectMode ? "Cancel" : "Select"}
            </button>
          <div className="filter-wrapper">
            <button className="filter-button" onClick={() => setIsFilterPanelOpen((open) => !open)}>
            {filter} Filter
            </button>
            {isFilterPanelOpen && (
              <FilterPanel
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                dueDateSort={dueDateSort}
                onDueDateSortChange={setDueDateSort}
                onClose={() => setIsFilterPanelOpen(false)}
              />
            )}
          </div>
          
          <AssigneeFilterButton 
            selectedValues={assigneeFilter} 
            onToggle={handleToggleAssigneeFilter}
            onClear={handleClearAssigneeFilter}
          />
          {hasActiveFilters && (
            <button className="clear-filters-link" onClick={handleClearFilters}>
              Clear filters
            </button>
          )}
        </div>
        
        {isSelectMode && (
          <div className="selection-bar">
            <span className="selection-count">{selectedTaskIds.size} selected</span>
            <select 
              className="selection-move-select"
              value=""
              onChange={(event) => {
                if (event.target.value) handleMoveSeleted(event.target.value);
              }}
              disabled={selectedTaskIds.size === 0}
              >
                <option value="" disabled>Move to...</option>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>{column.title}</option>
                ))}
              </select>
              <button
                type="button"
                className="selection-delete-button"
                onClick={handleDeleteSelected}
                disabled={selectedTaskIds.size === 0}
              >
                Delete
              </button>
          </div>
        )}

      </div>

      {columns.length === 0 ? (
      <EmptyState onAddTask={() => setAddTaskContext({columnId: null})} />
    ) : (
      <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title} 
          columnId={column.id} 
          color={column.color}
          isFinal={column.id === finalColumnId}
          onSetFinal={() => handleSetFinalColumn(column.id)}
          onColorChange={(color) => handleSetColumnColor(column.id, color)}
          tasks={displayTasks.filter((task) => task.columnId === column.id)} 
          onDelete={handleDelete} 
          onDrop={handleMoveTask} 
          onEdit={handleEdit}
          onEditTask={handleEditTaskRequest}
          onAddTask={(columnId) => setAddTaskContext({columnId})}
          onReorder={handleReorder} 
          draggedTaskId={draggedTaskId} 
          onDragStart={setDraggedTaskId} 
          onDragEnd={() => setDraggedTaskId(null)}
          onDeleteColumn={() => handleDeleteColumn(column.id)}
          onRenameColumn={handleRenameColumn}
          draggedColumnId={draggedColumnId}
          onColumnDragStart={setDraggedColumnId}
          onColumnDragEnd={() => setDraggedColumnId(null)}
          onColumnReorder={handleReorderColumns}
          isSelectMode={isSelectMode}
          selectedTaskIds={selectedTaskIds}
          onToggleTaskSelection={handleToggleTaskSelection}
        />
      ))}
      <button onClick={handleAddColumn} className="add-column-button">
        {unionIco}
      </button>
    </div>
    )}
    </>
    ) : (
      <Report
        tasks={tasks}
        description={PROJECT_DESCRIPTION}
        attachments={PROJECT_ATTACHMENTS}
      />
    )}

      {addTaskContext && (
      <TaskModal
        columns={columns}
        finalColumnId={finalColumnId}
        initialStageId={addTaskContext.columnId}
        onClose={() => setAddTaskContext(null)}
        onSubmit={handleAddTask}
      />
      )}
      {editingTask && (
        <TaskDetailModal
          task={editingTask}
          columns={columns}
          finalColumnId={finalColumnId}
          onClose={() => setEditingTaskId(null)}
          onSave={handleUpdateTask}
          onAddComment={handleAddComment}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      {columnToDelete && (
        <ConfirmDialog
          title="Delete column?"
          message={`This will pemanently delete "${columnToDelete.title}" and all of its tasks. This can't be undone`}
          confirmLabel="Delete column"
          onConfirm={handleConfirmDeleteColumn}
          onCancel={handleCancelDeleteColumn}
        />
      )}
    </div>
  )
}

export default ProjectBoard