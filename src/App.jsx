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

function App() {

  const [tasks, setTasks] = useState([
  {id: 1, text: "Купить ведро котят"},
  {id: 2, text: "Купить ведро щенят"}
]);

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }
  // const [count, setCount] = useState(0)
  return (
    <>
    <div>

      {tasks.map((task) => (
        <TaskCard
        key={task.id}
        text={task.text}
        onDelete={() => handleDelete(task.id)}
        />
      ))}
      
        {/* <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button> */}
    </div>
    </>
  )
}

export default App
