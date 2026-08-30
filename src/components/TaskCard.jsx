import { useState, useRef, useEffect } from 'react';
import { formatDueDate, getDisplayPriority } from "../utils/task";
import TaskMenu from './TaskMenu';
import AvatarStack from './AvatarStack';
import { normalizeAssignees } from '../users';
import { ellipsisIco, timerIco, userFilter, chevronIco } from '../icons';
import { getUserById } from '../users';


const PRIORITY_CLASSES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
  Frozen: "priority-frozen",
};

function TaskCard({text, id, priority, status, assignedTo, dueDate, subtasks, isDone, isHighlighted, isSelectMode, isSelected, onToggleSelect, onDelete, onEdit, onOpenTask, onToggleSubtask, draggedTaskId, onDragStart, onDragEnd}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const assigneeIds = normalizeAssignees(assignedTo);
  const cardRef = useRef(null);
  const isDragging = id === draggedTaskId;
  const subtaskList = subtasks ?? [];

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({behavior: "smooth", block: "center"});
    }
  }, [isHighlighted]);

  const handleStartEditing = () => {
    setDraftText(text);
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    const trimmed = draftText.trim();
    if (trimmed !== "" && trimmed !== text) {
      onEdit(id, trimmed);
    }
    setIsEditing(false);
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
    onDragStart(id);
  }

  const handleCardClick = () => {
      if (isEditing) return;
      if (isSelectMode) {
        onToggleSelect(id);
      } else {
        onOpenTask();
      }
  };

  const formattedDate = formatDueDate(dueDate);
  const priorityClass = PRIORITY_CLASSES[getDisplayPriority({priority, status})] ?? "priority-medium";
  const completedCount = subtaskList.filter((subtask) => subtask.completed).length;

  return ( 
    <div 
      ref={cardRef}
      className={`card ${isSelectMode ? "card-select-mode" : ""} ${isSelected ? "card-selected" : ""} ${isHighlighted ? "card-highlighted" : ""} ${isDragging ? "card-dragging" : ""}`}
      draggable={!isEditing && !isSelectMode}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
    >
    <div className="card-high-layer">
      {isSelectMode && (
        <input 
          type="checkbox" 
          className="card-select-checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
          onClick={(event) => event.stopPropagation()}  
        />
      )}
      {isEditing ? (
        <input
          type="text"
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          onBlur={handleFinishEditing} 
          onKeyDown={(event) => {
            if (event.key === "Enter") event.target.blur(); 
          }}
          autoFocus
        />
      ) : (
        <span
          onClick={isSelectMode ? undefined : (event) => { event.stopPropagation(); handleStartEditing(); }}
          className={`card-title ${isDone ? "task-done-text" : ""}`}
        >
          {isDone && <span className="done-check">✓</span>}
          <span className="card-title-text">{text}</span>
          <span className={`priority-badge ${priorityClass}`}>{getDisplayPriority({priority, status})}</span>
        </span>
      )}
      {!isSelectMode && (
        <div className="task-menu-wrapper">
          <button onClick={(event) => {event.stopPropagation(); setIsMenuOpen((open) => !open)}}>
            {ellipsisIco}
            </button>
            {isMenuOpen && (
              <TaskMenu
                showEdit={false}
                onDelete={() => {setIsMenuOpen(false); onDelete();}}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
        </div>
      )}
    </div>

    {subtaskList.length > 0 && (
      <div className="card-subtasks">
        <button
          type="button"
          className="card-subtasks-toggle"
          onClick={(event) => { event.stopPropagation(); setIsSubtasksOpen((open) => !open); }}
        >
          Subtasks
          <span className="subtasks-count-badge">{completedCount} of {subtaskList.length}</span>
          <span className={`chevron ${isSubtasksOpen ? "" : "closed"}`}>{chevronIco}</span>
        </button>
        {isSubtasksOpen && (
          <div className="card-subtasks-list" onClick={(event) => event.stopPropagation()}>
            {subtaskList.map((subtask) => (
              <label key={subtask.id} className="card-subtask-row">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(subtask.id)}
                />
                <span className={subtask.completed ? "subtask-done-text" : ""}>{subtask.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )}

    <div className="card-low-layer">
      <span>{timerIco}{formattedDate ? `Due ${formattedDate}` : "No due date"}</span>
      <AvatarStack userIds={assigneeIds} size={28} max={3} emptyIcon={userFilter} />
    </div>
    </div>
  );
}

export default TaskCard;