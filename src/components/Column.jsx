import { useState } from 'react';
import TaskCard from './TaskCard';



function Column({title, columnId, tasks, onDelete, onDrop, onEdit, onEditTask, onAddTask, onReorder, draggedTaskId, onDragStart, onDragEnd, onDeleteColumn, onRenameColumn, draggedColumnId, onColumnDragStart, onColumnDragEnd, onColumnReorder, isFinal, onSetFinal, isSelectMode, selectedTaskIds, onToggleTaskSelection}) {
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [dragOverId, setDragOverId] = useState(null);
  const [columnDragOverSide, setColumnDragOverSide] = useState(null);

  const handleColumnDragStart = (event) => {
    event.dataTransfer.setData("application/column-id", columnId);
    onColumnDragStart(columnId);
  };

  const handleColumnDragOver = (event) => {
    if (draggedColumnId === null || draggedColumnId === columnId) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    setColumnDragOverSide(event.clientX < midpoint ? "before" : "after");
  };

  const handleColumnDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setColumnDragOverSide(null);
    }
  }

  const handleColumnDrop = (event) => {
    if (draggedColumnId === null || draggedColumnId === columnId) return;
    event.preventDefault();
    event.stopPropagation();
    onColumnReorder(draggedColumnId, columnId, columnDragOverSide);
    setColumnDragOverSide(null);
  }

  const handleContainerDragOver = (event) => {
    if (draggedColumnId !== null) {
      handleColumnDragOver(event);
    } else {
      handleDragOver(event);
    }
  };

  const handleContainerDragLeave = (event) => {
    if (draggedColumnId !== null) {
      handleColumnDragLeave(event);
    } else {
      handleDragLeave(event);
    }
  };

  const handleContainerDrop = (event) => {
    if (draggedColumnId !== null) {
      handleColumnDrop(event);
    } else {
      handleDrop(event);
    }
  };

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
    if (draggedColumnId !== null) return;
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
    if (draggedColumnId !== null) return;
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

  // const isDoneColumn = columnId === "done";

  return (
    <div 
      className={`column ${columnDragOverSide ? `column-drag-over-${columnDragOverSide}` : ""}`}
      onDragOver={handleContainerDragOver} 
      onDragLeave={handleContainerDragLeave}
      onDrop={handleContainerDrop}
    >
      <button onClick={onDeleteColumn} className="column-delete-button">х</button>
      <button
          className="column-final-toggle"
          onClick={onSetFinal}
          title={isFinal ? "Final column" : "Mark as fina; column"}
        >
          {isFinal ? "★" : "☆"}
        </button>
      <h2
        draggable={!isEditingTitle}
        onDragStart={handleColumnDragStart}
        onDragEnd={() => {onColumnDragEnd(); setColumnDragOverSide(null);}}
        >
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
              priority={task.priority}
              status={task.status}
              dueDate={task.dueDate}
              isDone={isFinal}
              isSelectMode={isSelectMode}
              isSelected={selectedTaskIds.has(task.id)}
              onToggleSelect={onToggleTaskSelection}
              onDelete={() => onDelete(task.id)}
              onEdit={onEdit}
              onEditRequest={() => onEditTask(task.id)}
              draggedTaskId={draggedTaskId}
              onDragStart={onDragStart}
              onDragEnd={() => {onDragEnd(); setDragOverId(null)}}
            />
          </div>
        ))}
        {dragOverId === "end" && <div className="drop-indicator"/>}
      </div>
      <button className="add-task-in-column" onClick={() => onAddTask(columnId)}>
        + Add
      </button>
    </div>
  );
}

export default Column;