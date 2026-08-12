import { useEffect, useState } from 'react';
import Column from './components/Column';
import EmptyState from './components/EmptyState';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import FilterPanel from './components/FilterPanel';
import {getDisplayPriority} from "./utils/task"
import Report from './components/Report';

import searchIcon from './assets/Search_icon.svg';
import userFilter from './assets/User_Filter.svg';
import filter from './assets/filter.svg';
import './App.css';

const unionIco = <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.81055 5.18945H12V6.81055H6.81055V12H5.18945V6.81055H0V5.18945H5.18945V0H6.81055V5.18945Z"/>
</svg>
const shareIco = <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5332 0C16.6539 8.24378e-05 18.3737 1.71923 18.374 3.83984C18.374 5.96072 16.6541 7.68058 14.5332 7.68066C13.5711 7.68061 12.6923 7.326 12.0186 6.74121L8.55762 8.9668C8.65854 9.31036 8.71381 9.6736 8.71387 10.0498C8.71387 10.4263 8.65766 10.7899 8.55664 11.1338L12.0176 13.3594C12.6914 12.7746 13.5709 12.42 14.5332 12.4199C16.6539 12.42 18.3737 14.1392 18.374 16.2598C18.374 18.3806 16.6541 20.1005 14.5332 20.1006C12.4124 20.1005 10.6934 18.3806 10.6934 16.2598C10.6934 15.8836 10.7478 15.5203 10.8486 15.1768L7.3877 12.9512C6.71374 13.5359 5.83516 13.8906 4.87305 13.8906C2.75223 13.8905 1.0332 12.1707 1.0332 10.0498C1.03352 7.92923 2.75242 6.21009 4.87305 6.20996C5.83507 6.20996 6.71377 6.56496 7.3877 7.14941L10.8496 4.92383C10.7487 4.58004 10.6934 4.21628 10.6934 3.83984C10.6937 1.71926 12.4126 0.00012665 14.5332 0ZM14.5332 14.5801C13.6058 14.5802 12.8538 15.3324 12.8535 16.2598C12.8535 17.1874 13.6056 17.9393 14.5332 17.9395C15.4608 17.9394 16.2129 17.1874 16.2129 16.2598C16.2126 15.3324 15.4606 14.5802 14.5332 14.5801ZM4.87305 8.37012C3.94567 8.37024 3.19368 9.12247 3.19336 10.0498C3.19336 10.9774 3.94547 11.7294 4.87305 11.7295C5.80073 11.7295 6.55273 10.9775 6.55273 10.0498C6.55241 9.12239 5.80053 8.37012 4.87305 8.37012ZM14.5332 2.16016C13.6058 2.16028 12.8538 2.9125 12.8535 3.83984C12.8535 4.76745 13.6056 5.5194 14.5332 5.51953C15.4608 5.51945 16.2129 4.76748 16.2129 3.83984C16.2126 2.91248 15.4606 2.16024 14.5332 2.16016Z" fill="#82858D"/>
</svg>
const ellipsisIco = <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.5254 1.94063C15.5254 2.19547 15.4752 2.44782 15.3777 2.68327C15.2801 2.91872 15.1372 3.13265 14.957 3.31285C14.7768 3.49306 14.5629 3.636 14.3274 3.73353C14.092 3.83105 13.8396 3.88125 13.5848 3.88125C13.3299 3.88125 13.0776 3.83105 12.8421 3.73353C12.6067 3.636 12.3927 3.49306 12.2125 3.31285C12.0323 3.13265 11.8894 2.91872 11.7919 2.68327C11.6943 2.44782 11.6441 2.19547 11.6441 1.94063C11.6441 1.42594 11.8486 0.932333 12.2125 0.568396C12.5765 0.204458 13.0701 0 13.5848 0C14.0995 0 14.5931 0.204458 14.957 0.568396C15.3209 0.932333 15.5254 1.42594 15.5254 1.94063ZM9.70352 1.94063C9.70352 2.45531 9.49906 2.94892 9.13512 3.31285C8.77118 3.67679 8.27758 3.88125 7.76289 3.88125C7.2482 3.88125 6.7546 3.67679 6.39066 3.31285C6.02672 2.94892 5.82227 2.45531 5.82227 1.94063C5.82227 1.42594 6.02672 0.932333 6.39066 0.568396C6.7546 0.204458 7.2482 0 7.76289 0C8.27758 0 8.77118 0.204458 9.13512 0.568396C9.49906 0.932333 9.70352 1.42594 9.70352 1.94063ZM1.94102 3.88125C2.4557 3.88125 2.94931 3.67679 3.31324 3.31285C3.67718 2.94892 3.88164 2.45531 3.88164 1.94063C3.88164 1.42594 3.67718 0.932333 3.31324 0.568396C2.94931 0.204458 2.4557 0 1.94102 0C1.42633 0 0.932724 0.204458 0.568786 0.568396C0.204848 0.932333 0.000390053 1.42594 0.000390053 1.94063C0.000390053 2.45531 0.204848 2.94892 0.568786 3.31285C0.932724 3.67679 1.42633 3.88125 1.94102 3.88125Z" fill="#82858D"/>
</svg>



const PROJECT_NAME = "Your Project";
const PROJECT_DESCRIPTION = "info about project.";
const PROJECT_ATTACHMENTS = [
  {name: "Client_Proporsal.xls", meta: "Today - 4 MB"},
  {name: "PRD.docx", meta: "Yesterday - Google Docs"},
];


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

  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <>
    <div className="project-header">
      <h1>{PROJECT_NAME}</h1>
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
          <div className="search-input-wrapper">
            <img src={searchIcon} alt="" className="search-icon" />
          <input className="add-task-button"
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
    </>
    ) : (
      <Report
        tasks={tasks}
        finalColumnId={finalColumnId}
        description={PROJECT_DESCRIPTION}
        attachments={PROJECT_ATTACHMENTS}
      />
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