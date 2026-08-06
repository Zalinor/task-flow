import { useEffect, useState } from 'react'
import Column from './components/Column'
import AddTaskModal from './components/AddTaskModal'
import EmptyState from './components/EmptyState'

import searchIcon from './assets/Search_icon.svg'
import unionIcon from './assets/Union.svg'
import userFilter from './assets/User_Filter.svg'
import filter from './assets/filter.svg'
import './App.css'



function App() {
  // Single source of truth for columns, same pattern as tasks
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("columns");
    return saved ? JSON.parse(saved) : [
      {id: "todo", title: "To Do"},
      {id: "in-progress", title: "In Progress"},
      {id: "done", title: "Done"},
    ];
  });

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
  
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

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
    setIsModalOpen(false);
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
  return (
    <>
    <div className="project-row">
      <div className="task-input-row">
        <button 
          className="task-button"
          onClick={() => setIsModalOpen(true)}>
            <img src={unionIcon}/> Add Task
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
        <button className="filter-button"><img src={filter} alt=""/> Filter</button>
        <div className="user-filter-row">
          <button className="user-avatar">
          </button>
            <button className="user-avatar"></button>
</div>
        <a href=""><span>Clear filters</span></a>
      </div>
    </div>
      
    {columns.length === 0 ? (
      <EmptyState onAddTask={() => setIsModalOpen(true)} />
    ) : (
      <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title} 
          columnId={column.id} 
          tasks={sortedTasks.filter((task) => task.columnId === column.id)} 
          onDelete={handleDelete} 
          onDrop={handleMoveTask} 
          onEdit={handleEdit} 
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
      <button onClick={handleAddColumn} className="add-column-button"> + Add Column</button>
    </div>
    )}
    
      {isModalOpen && (
      <AddTaskModal
        columns={columns}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
      )}
    </>
  )
}

export default App