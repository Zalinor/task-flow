import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function TaskCard({ text }) {
  return <div className="card">{text}</div>;
}
const tasks = [
  {id: 1, text: "Купить ведро котят"},
  {id: 2, text: "Купить ведро щенят"},
  {id: 3, text: "Купить ведро цыплят"}
];

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("Чишачок");
  return (
    <>
    <div>
      {tasks.map((task) => (
        <TaskCard key = {task.id} text={task.text}/>
      ))}
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
          Name is {name}
        </button>
    </div>
    </>
  )
}

export default App
