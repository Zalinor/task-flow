import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// A single task card. Recieves data via props from the parent (Column)
function TaskCard({ text, id, onDelete }) {
  // Fires when the user starts dragging this card
  // We store the task id in the drag event so the drop target can read it later
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
  }
  return ( 
    <div className="card" draggable onDragStart={handleDragStart}>
      {text}
      <button onClick={onDelete}>X</button>
    </div>
  );
}

// A single board column (e.g. "To Do"). Renders the tasks it's given
// and doesn't known anything about the full task list - just what's passed in
function Column({title, status, tasks, onDelete, onDrop}) {
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
      <h2>{title}</h2>
      <div className="cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            text={task.text}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  // Single source of truth: a;; tasks live here, regardless of status
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  // Derived data: instead of storing 3 separate arrays, we filter
  // the same "tasks" array be status on every render
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  // Creates a new task and adds it to the list, always starting as "todo"
  const handleAdd = () => {
    const text = inputValue.trim();
    if (text === "") return;
    
    const newTask = {
      id: Date.now(),
      text: text,
      status: "todo"
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
      <Column title="To Do" status = "todo" tasks={todoTasks} onDelete={handleDelete} onDrop={handleDrop}/>
      <Column title="In Progress" status = "in-progress" tasks={inProgressTasks} onDelete={handleDelete} onDrop={handleDrop}/>
      <Column title="Done" status = "done" tasks={doneTasks} onDelete={handleDelete} onDrop={handleDrop}/>
    </div>
    </>
  )
}

export default App
