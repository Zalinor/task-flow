import { useState } from 'react'
import TaskCard from './TaskCard'



function Column({title, columnId, tasks, onDelete, onDrop, onEdit, onReorder, draggedTaskId, onDragStart, onDragEnd, onDeleteColumn, onRenameColumn}) {
  
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title);
  const [dragOverId, setDragOverId] = useState(null);

  const handleStartEditingTitle = () => {
    setDraftTitle(title);
    setIsEditingTitle(true);
  };

  const handleFinishEditingTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed !== "" && trimmed !== title) {
      onRenameColumn(columnId, trimmed);
    }
    setIsEditingTitle(false);
  };

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
    onDrop(taskId, columnId);
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
    onDrop(draggedId, columnId);

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
      <h2>
        {isEditingTitle ? (
          <input 
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={handleFinishEditingTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.target.blur();
            }}
            autoFocus
          />
        ) : (
          <span onClick={handleStartEditingTitle}>{title}</span>
        )}
        <span className="count">{tasks.length}</span>
        <button onClick={onDeleteColumn}>x</button>
      </h2>
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

export default Column;