import { useState, useRef, useEffect } from 'react';
import { formatDueDate, getDisplayPriority, autoResizeTextarea } from "../utils/task";
import AvatarStack from './AvatarStack';
import { normalizeAssignees } from '../users';
import { ellipsisIco, timerIco, userFilter, chevronIco, subtaskRemove, userIco, pencilIco } from '../icons';
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
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const assigneeIds = normalizeAssignees(assignedTo);
  const cardRef = useRef(null);
  const titleTextareaRef = useRef(null);
  const isDragging = id === draggedTaskId;
  const subtaskList = subtasks ?? [];

  useEffect(() => {
    if (isEditing) autoResizeTextarea(titleTextareaRef.current);
  }, [isEditing]);

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
      <span className={`priority-badge ${priorityClass}`}>{getDisplayPriority({priority, status})}</span>
      {isSelectMode && (
        <label className="select-checkbox-label" onClick={(event) => event.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onToggleSelect(id)}
          />
          <span className="select-checkmark"></span>
        </label>
      )}
      
      {!isSelectMode && (
          <button
            type="button"
            className="card-delete-button"
            onClick={(event) => { event.stopPropagation(); onDelete(); }}
          >
            {subtaskRemove}
          </button>
      )}
    </div>
      {isEditing ? (
        <textarea
          ref={titleTextareaRef}
          className="card-title-textarea"
          value={draftText}
          onChange={(event) => { setDraftText(event.target.value); autoResizeTextarea(event.target); }}
          onBlur={handleFinishEditing}
          maxLength={255}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); event.target.blur(); }
          }}
          onClick={(event) => event.stopPropagation()}
          autoFocus
          rows={1}
        />
      ) : (
        <span className={`card-title ${isDone ? "task-done-text" : ""}`}>
          <span className="card-title-text">{text}</span>
          {!isSelectMode && (
            <button
              type="button"
              className="card-title-edit-button"
              onClick={(event) => { event.stopPropagation(); handleStartEditing(); }}
            >
              {pencilIco}
            </button>
          )}
        </span>
      )}
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
          <div className="card-subtasks-list">
            {subtaskList.map((subtask) => (
              <div key={subtask.id} className="card-subtask-row">
                <label className="card-subtask-checkbox-label" onClick={(event) => event.stopPropagation()}>
                  <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => onToggleSubtask(subtask.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span
                  className={`card-subtask-text ${subtask.completed ? "subtask-done-text" : ""}`}
                  onClick={(event) => { event.stopPropagation(); onOpenTask(); }}
                >
                  {subtask.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    <div className="card-low-layer">
      <span>{timerIco}{formattedDate ? `${formattedDate}` : "No due date"}</span>
      <AvatarStack userIds={assigneeIds} size={30} max={3} emptyIcon={userIco} />
    </div>
    </div>
  );
}

export default TaskCard;