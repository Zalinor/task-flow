import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function TaskCard({ text, onDelete }) {
  return <div className="card">
    {text}
    <button onClick={onDelete}>X</button>
    </div>;
}

function Column({title, tasks, onDelete}) {
  return(
    <div className="column">
      <h2>{title}</h2>
      <div className="cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            text={task.text}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");



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

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }
  return (
    <>
    <div>
      <input 
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)} 
      />
      <button onClick={handleAdd}>Добавить</button>
    </div>

    <div className="board">
      <Column title="To Do" tasks={todoTasks} onDelete={handleDelete}/>
      <Column title="In Progress" tasks={inProgressTasks} onDelete={handleDelete}/>
      <Column title="Done" tasks={doneTasks} onDelete={handleDelete}/>
    </div>
    </>
  )
}

export default App
