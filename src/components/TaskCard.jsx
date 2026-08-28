import { useState } from 'react';
import { formatDueDate, getDisplayPriority } from "../utils/task";
import TaskMenu from './TaskMenu';
import AvatarStack from './AvatarStack';
import { normalizeAssignees } from '../users';
import { ellipsisIco, timerIco, userFilter } from '../icons';
import { getUserById, getInitials } from '../users';


const PRIORITY_CLASSES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
  Frozen: "priority-frozen",
};

// A single task card. Recieves data via props from the parent (Column)
function TaskCard({text, id, priority, status, assignedTo, dueDate, isDone, isHighlighted, isSelectMode, isSelected, onToggleSelect, onDelete, onEdit, onEditRequest, draggedTaskId, onDragStart, onDragEnd}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const assignedUser = getUserById(assignedTo);
  const assigneeIds = normalizeAssignees(assignedTo);

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

  const handleCardClick = () => {
    if (isSelectMode) {
      onToggleSelect(id);
    }
  };

  const formattedDate = formatDueDate(dueDate);
  const priorityClass = PRIORITY_CLASSES[getDisplayPriority({priority, status})] ?? "priority-medium";

  return ( 
    <div 
      className={`card ${isSelectMode ? "card-select-mode" : ""} ${isSelected ? "card-selected" : ""} ${isHighlighted ? "card-highlighted" : ""}`}
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
        // Edit mode: an input bound to the draft text
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
        <span onClick={isSelectMode ? undefined : handleStartEditing} className={isDone ? "task-done-text" : ""}>
          {isDone && <span className="done-check">✓</span>}
          {text} <span className={`priority-badge ${priorityClass}`}>{getDisplayPriority({priority, status})}</span> 
        </span>
      )}
      {!isSelectMode && (
        <div className="task-menu-wrapper">
          <button onClick={(event) => {event.stopPropagation(); setIsMenuOpen((open) => !open)}}>
            {ellipsisIco}
            </button>
            {isMenuOpen && (
              <TaskMenu
                onEdit={() => {setIsMenuOpen(false); onEditRequest();}}
                onDelete={() => {setIsMenuOpen(false); onDelete();}}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
        </div>
      )}
      
      
    </div>
    <div className="card-low-layer">
      <span>{timerIco}{formattedDate ? `Due ${formattedDate}` : "No due date"}</span>
      <AvatarStack userIds={assigneeIds} size={28} max={3} emptyIcon={userFilter} />
    </div>
    </div>
  );
}

export default TaskCard;