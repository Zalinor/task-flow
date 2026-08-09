import {useState} from 'react';
import ellipsis from '../assets/ellipsis.svg';
import timer from '../assets/timer.svg';
import userFilter from '../assets/User_Filter.svg';
import TaskMenu from './TaskMenu';
import {getDisplayPriority} from "../utils/task"


const PRIORITY_CLASSES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
  Frozen: "priority-frozen",
};

function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const [year, month, day] = dueDate.split("-")
  return `${month}/${day}`;
}
// A single task card. Recieves data via props from the parent (Column)
function TaskCard({text, id, priority, status, dueDate, isDone, onDelete, onEdit, onEditRequest, draggedTaskId, onDragStart, onDragEnd}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const formattedDate = formatDueDate(dueDate);
  const displayPriority = getDisplayPriority({priority, status});
  const priorityClass = PRIORITY_CLASSES[displayPriority] ?? "priority-medium";

  return ( 
    <div 
      className="card"
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
    <div className="card-high-layer">
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
        <span onClick={handleStartEditing} className={isDone ? "task-done-text" : ""}>
          {isDone && <span className="done-check">✓</span>}
          {text} <span className={`priority-badge ${priorityClass}`}>{displayPriority}</span> 
        </span>
      )}
      <div className="task-menu-wrapper">
        <button onClick={() => setIsMenuOpen((open) => !open)}>
          <img src={ellipsis}/>
          </button>
          {isMenuOpen && (
            <TaskMenu
              onEdit={() => {setIsMenuOpen(false); onEditRequest();}}
              onDelete={() => {setIsMenuOpen(false); onDelete();}}
              onClose={() => setIsMenuOpen(false)}
            />
          )}
      </div>
      
    </div>
    <div className="card-low-layer">
      <span><img src={timer}/>{formattedDate ? `Due ${formattedDate}` : "No due date"}</span>
      <img src={userFilter} alt="" width={28} height={28}/>
    </div>
      
    </div>
  );
}

export default TaskCard;