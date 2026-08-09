import { useEffect, useState } from 'react';
import Column from './components/Column';
import EmptyState from './components/EmptyState';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import FilterPanel from './components/FilterPanel';
import {getDisplayPriority} from "./utils/task"

import searchIcon from './assets/Search_icon.svg';
import userFilter from './assets/User_Filter.svg';
import filter from './assets/filter.svg';
import './App.css';

const unionIco = <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.81055 5.18945H12V6.81055H6.81055V12H5.18945V6.81055H0V5.18945H5.18945V0H6.81055V5.18945Z" fill="#82858D"/>
</svg>


function App() {
  // Single source of truth for columns, same pattern as tasks
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("columns");
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
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const handleRenameColumnn = (columnId, newTitle) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? {...column, title: newTitle} : column
      )
    )
  };

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
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");

  // Persist task to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueDateSort, setDueDateSort] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const hasActiveFilters = statusFilter !== "All" || priorityFilter !== "All" || dueDateSort !== null;

  const handleClearFilters = () => {
    setStatusFilter("All");
    setPriorityFilter("All");
    setDueDateSort(null);
  };

  const taskMatchesFilters = (task) => {
    if (statusFilter === "Done") {
      if (!finalColumnId || task.columnId !== finalColumnId) return false;
    } else if (statusFilter !== "All" && task.status !== statusFilter) {
      return false;
    }
    if (priorityFilter !== "All" && getDisplayPriority(task) !== priorityFilter) {
      return false;
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

  // Updates a task's status when it's dropped into a different column
  const handleMoveTask = (taskId, newColumnId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    );
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
    const newComment = {
      id: crypto.randomUUID(),
      author: "You", //Placeholder
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
  return (
    <>
    <div className="project-row">
      <div className="task-input-row">
        <button 
          className="task-button"
          onClick={() => setAddTaskContext({columnId: null})}>
            {unionIco}
            Add Task
          </button>
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="" className="search-icon" />
        <input
          type="text"
          placeholder="Search Work"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)} 
        />  
        </div>
        <div className="filter-wrapper">
          <button className="filter-button" onClick={() => setIsFilterPanelOpen((open) => !open)}>
          <img src={filter} alt=""/> Filter
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
        
        <div className="user-filter-row">
          <button className="user-avatar"></button>
            <button className="user-avatar"></button>
        </div>
        {hasActiveFilters && (
          <button className="clear-filters-link" onClick={handleClearFilters}>
            Clear filters
          </button>
        )}
      </div>
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
          isFinal={column.id === finalColumnId}
          onSetFinal={() => handleSetFinalColumn(column.id)}
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
          onRenameColumn={handleRenameColumnn}
          draggedColumnId={draggedColumnId}
          onColumnDragStart={setDraggedColumnId}
          onColumnDragEnd={() => setDraggedColumnId(null)}
          onColumnReorder={handleReorderColumns}
        />
      ))}
      <button onClick={handleAddColumn} className="add-column-button">
        {unionIco}
      </button>
    </div>
    )}
    
      {addTaskContext && (
      <TaskModal
        columns={columns}
        initialStageId={addTaskContext.columnId}
        onClose={() => setAddTaskContext(null)}
        onSubmit={handleAddTask}
      />
      )}
      {editingTask && (
        <TaskDetailModal
          task={editingTask}
          columns={columns}
          onClose={() => setEditingTaskId(null)}
          onSave={handleUpdateTask}
          onAddComment={handleAddComment}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </>
  )
}

export default App