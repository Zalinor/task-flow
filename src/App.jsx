import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// A single task card. Recieves data via props from the parent (Column)
function TaskCard({text, id, onDelete, onEdit, draggedTaskId, onDragStart, onDragEnd}) {
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

  
  // Fires when the user starts dragging this card
  // We store the task id in the drag event so the drop target can read it later
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
    onDragStart(id);
  }
  return ( 
    <div 
      className="card"
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
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
function Column({title, status, tasks, onDelete, onDrop, onEdit, onReorder, draggedTaskId, onDragStart, onDragEnd}) {
  // Which task the dragged card is currently hovering over, or "end" if hovering over
  // empty space below the last card. null - not dragging here.
  const [dragOverId, setDragOverId] = useState(null);

  // Hovering over empty column space (not a specific card)
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOverId("end");
  }

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragOverId(null); 
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    onDrop(taskId, status);
    onReorder(taskId, null);
    setDragOverId(null);
  };

  // Determines before/after based on cursor position within the slot, then figures out
  // which task id to show the indicator next to
  const getPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    return event.clientY < midpoint ? "before" : "after";
  };

  const handleSlotDragOver = (taskId) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const position = getPosition(event);

    if (position === "before") {
      setDragOverId(taskId);
    } else {
      const index = tasks.findIndex((task) => task.id === taskId);
      const nextTask = tasks[index + 1];
      setDragOverId(nextTask ? nextTask.id : "end");
    }
  };

  const handleSlotDrop = (taskId) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = Number(event.dataTransfer.getData("text/plain"));
    if (draggedId === taskId) return;

    const position = getPosition(event);
    onDrop(draggedId, status);

    if (position === "before") {
      onReorder(draggedId, taskId);
    } else {
      const index = tasks.findIndex((task) => task.id === taskId);
      const nextTask = tasks[index + 1];
      onReorder(draggedId, nextTask ? nextTask.id : null);
    }
    setDragOverId(null);
  };


  return (
    <div 
      className="column" 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>{title} <span className="count">{tasks.length}</span></h2>
      <div className="cards">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="card-slot"
            onDragOver={handleSlotDragOver(task.id)}
            onDrop={handleSlotDrop(task.id)}
          >
            {dragOverId === task.id && <div className="drop-indicator" />}
            <TaskCard
              id={task.id}
              text={task.text}
              onDelete={() => onDelete(task.id)}
              onEdit={onEdit}
              draggedTaskId={draggedTaskId}
              onDragStart={onDragStart}
              onDragEnd={() => {onDragEnd(); setDragOverId(null)}}
            />
          </div>
        ))}
        {dragOverId === "end" && <div className="drop-indicator"/>}
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

  const [draggedTaskId, setDraggedTaskId] = useState(null);
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
      <Column title="To Do" status = "todo" tasks={todoTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder} draggedTaskId={draggedTaskId} onDragStart={setDraggedTaskId} onDragEnd={() => setDraggedTaskId(null)}/>
      <Column title="In Progress" status = "in-progress" tasks={inProgressTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder} draggedTaskId={draggedTaskId} onDragStart={setDraggedTaskId} onDragEnd={() => setDraggedTaskId(null)}/>
      <Column title="Done" status = "done" tasks={doneTasks} onDelete={handleDelete} onDrop={handleDrop} onEdit={handleEdit} onReorder={handleReorder} draggedTaskId={draggedTaskId} onDragStart={setDraggedTaskId} onDragEnd={() => setDraggedTaskId(null)}/>
    </div>
    </>
  )
}

export default App