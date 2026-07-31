import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// A single task card. Recieves data via props from the parent (Column)
function TaskCard({text, id, onDelete, onEdit, onReorder}) {
  // Whether this card is currently showing an editable input instead of plain text
  const [isEditing, setIsEditing] = useState(false);

  // Local draft of the while the user is typing - kept separate from
  // the "official" text prop so nothing is saved until editing finishes
  const [draftText, setDraftText] = useState(text);

  // Switches the card into edit mode, resetting the draft to the current saved text
  const handleStartEditing = () => {
    setDraftText(text);
    setIsEditing(true);
  };

  // Saves the edited text (if it actually changed) and exits edit mode
  const handleFinishEditing = () => {
    const trimmed = draftText.trim();
    if (trimmed !== "" && trimmed !== text) {
      onEdit(id, trimmed); // tell App to update this task's text
    }
    setIsEditing(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = Number(event.dataTransfer.getData("text/plain"));
    if (draggedId === id) return;
    onReorder(draggedId, id);
  };
  // Fires when the user starts dragging this card
  // We store the task id in the drag event so the drop target can read it later
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
  }
  return ( 
    <div 
      className="card"
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isEditing ? (
        // Edit mode: an input bound to the draft text
        <input
          type="text"
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          onBlur={handleFinishEditing} //clicking away saves and exit mode
          onKeyDown={(event) => {
            if (event.key === "Enter") event.target.blur(); // Enter also saves
          }}
          autoFocus
        />
      ) : (
        // Normal mode: plain text, click to start editing
        <span onClick={handleStartEditing}>{text}</span>
      )}
      <button onClick={onDelete}>X</button>
    </div>
  );
}

// A single board column (e.g. "To Do"). Renders the tasks it's given
// and doesn't known anything about the full task list - just what's passed in
function Column({title, status, tasks, onDelete, onDrop, onEdit, onReorder}) {
  // Required to allow dropping - browsers block drop by default otherwise
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Fires when a card is dropped on this column
  // Reads the dragged task's id and tells the parent to update its status
  const handleDrop = (event) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    onDrop(taskId, status);
  };

  return (
    <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h2>{title} <span className="count">{tasks.length}</span></h2>
      <div className="cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            order={task.order}
            text={task.text}
            onDelete={() => onDelete(task.id)}
            onEdit={onEdit}
            onReorder={onReorder}
          />
        ))}
      </div>
    </div>
  );
}




function App() {
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
  // Derived data: instead of storing 3 separate arrays, we filter
  // the same "tasks" array be status on every render
  const todoTasks = sortedTasks.filter((task) => task.status === "todo");
  const inProgressTasks = sortedTasks.filter((task) => task.status === "in-progress");
  const doneTasks = sortedTasks.filter((task) => task.status === "done");

  // Creates a new task and adds it to the list, always starting as "todo"
  const handleAdd = () => {
    const text = inputValue.trim();
    if (text === "") return;
    
    const newTask = {
      id: Date.now(),
      text: text,
      status: "todo",
      order: tasks.length
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  // Removes a task by id
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Updates a task's status when it's dropped into a different column
  const handleDrop = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
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
      const targetIndex = prevTasks.findIndex((task) => task.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prevTasks;

      const updated = [...prevTasks];
      const [draggedTask] = updated.splice(draggedIndex, 1);
      const newTargetIndex = updated.findIndex((task) => task.id === targetId);
      updated.splice(newTargetIndex, 0, draggedTask);

      // reassign order to match the new array positions, avoiding any duplicate value
      return updated.map((task, index) => ({...task, order: index}));
    });
  };
  return (
    <>
    <div className="task-input-row">
      <input 
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)} 
      />
      <button onClick={handleAdd}>Добавить</button>
    </div>

    <div className="board">
      <Column title="To Do" status = "todo" tasks={todoTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder}/>
      <Column title="In Progress" status = "in-progress" tasks={inProgressTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder}/>
      <Column title="Done" status = "done" tasks={doneTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder}/>
    </div>
    </>
  )
}

export default App