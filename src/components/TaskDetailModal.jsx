import { useRef, useState } from "react";
import { USERS, normalizeAssignees, getUserById } from "../users";
import UserAvatar from "./UserAvatar";
import { sendIco, pencilIco } from "../icons"
import TaskMenu from "./TaskMenu";
import DateTimePicker from "./DateTimePicker";
import { formatDueDate, formatTimestamp } from "../utils/task";

function TaskDetailModal({task, columns, finalColumnId, currentUser, onClose, onSave, onAddComment, onDelete, onEdit}) {
    const [stageId, setStageId] = useState(task.columnId);
    const [priority, setPriority] = useState(task.priority ?? "Medium");
    const [status, setStatus] = useState(task.status ?? "Open");
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(task.dueDate ?? "");

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.text);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerPosition, setDatePickerPosition] = useState(null);
    const dueDateFieldRef = useRef(null);

    const handleOpenDatePicker = () => {
        if (dueDateFieldRef.current) {
            const rect = dueDateFieldRef.current.getBoundingClientRect();
            const estimatedHeight = 430;
            const openUpward = rect.top - estimatedHeight - 8 > 0;
            setDatePickerPosition({
                top: openUpward ? rect.top - 8 : rect.bottom + 8,
                left: rect.left + rect.width / 2,
                openUpward,
            });
        }
        setIsDatePickerOpen(true);
    };

    const handleApplyDate = (value) => {
        setDueDate(value);
        setIsDatePickerOpen(false);
    };

    const [assignedIds, setAssignedIds] = useState(normalizeAssignees(task.assignedTo));
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [commentDraft, setCommentDraft] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const comments = task.comments ?? [];

    const handleAddAssignee = (userId) => {
        setAssignedIds((prev) => [...prev, userId]);
        setIsAddingUser(false);
    };

    const handleRemoveAssignee = (userId) => {
        setAssignedIds((prev) => prev.filter((id) => id !== userId));
    }

    const handleStageChange = (event) => {
        const newStageId = event.target.value;
        setStageId(newStageId);
        if (finalColumnId && newStageId === finalColumnId) {
            setStatus("Completed");
        }
    }

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if (newStatus === "Completed" && finalColumnId) {
            setStageId(finalColumnId);
        }
    }

    const handleSave = () => {
        onSave({
            id: task.id,
            text: task.text,
            columnId: stageId,
            priority,
            status,
            description: description.trim(),
            dueDate,
            assignedTo: assignedIds,
        });
    };

    const handleSubmitComment = (event) => {
        event.preventDefault();
        const trimmed = commentDraft.trim();
        if (trimmed === "") return;
        onAddComment(task.id, trimmed);
        setCommentDraft("");
    }

    const formattedDueDate = formatDueDate(dueDate);
    const formattedUpdatedAt = formatTimestamp(task.updatedAt);

    const handleStartEditingTitle = () => {
        setDraftTitle(task.text);
        setIsEditingTitle(true);
    };
    const handleFinishEditingTitle = () => {
        const trimmed = draftTitle.trim();
        if (trimmed !== "" && trimmed !== task.text) {
            onEdit(task.id, trimmed);
        }
        setIsEditingTitle(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal task-detail-modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            className="task-detail-title-input"
                            value={draftTitle}
                            onChange={(event) => setDraftTitle(event.target.value)}
                            onBlur={handleFinishEditingTitle}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") event.target.blur();                               
                            }}
                            autoFocus
                        />
                    ) : (
                        <h3 onClick={handleStartEditingTitle}>{task.text}</h3>
                    )}
                        <div className="task-detail-menu-wrapper">
                            <button onClick={() => setIsMenuOpen((open) => !open)}>...</button>
                            {isMenuOpen && (
                                <TaskMenu
                                    showEdit={false}
                                    onDelete={() => {setIsMenuOpen(false); onDelete(task.id); onClose();}}
                                    onClose={() => setIsMenuOpen(false)}
                                />
                            )}
                        </div>
                        <button onClick={onClose}>x</button>
                </div>

                <div className="task-detail-body">
                    {/* Left column: Description, Date, Updated, Comments */}
                    <div className="task-detail-left">
                        <div className="task-detail-field">
                            <label>
                                Description
                                <button
                                    type="button"
                                    className="pencil-button"
                                    onClick={() => setIsEditingDescription((open) => !open)}
                                >
                                {pencilIco}
                                </button>
                            </label>
                            {isEditingDescription ? (
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    onBlur={() => setIsEditingDescription(false)}
                                    autoFocus
                                />
                            ) : (
                                <p>{description || "No description"}</p>
                            )}
                        </div>

                        <div className="task-detail-field" ref={dueDateFieldRef}>
                            <label>Due Date</label>
                            <p onClick={handleOpenDatePicker} style={{cursor: "pointer"}}>
                                {formattedDueDate ?? "No due date"}
                            </p>
                        </div>

                        <p className="task-detail-updated">
                            Updated {formattedUpdatedAt ?? "-"}
                        </p>

                        <div className="task-detail-comments">
                            <label>Comments</label>
                            <div className="comments-list">
                                {comments.length === 0 && <p className="no-comments">No comments yet</p>}
                                {comments.map((comment) => {
                                    const commentUser = getUserById(comment.authorId);
                                    return (
                                        <div key={comment.id} className="comment">
                                            <UserAvatar user={commentUser} size={28} className="comment-avatar"/>
                                            <div>
                                                <p className="comment-meta">
                                                    <strong>{comment.author}</strong> {formatTimestamp(comment.createdAt)}
                                                </p>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <form onSubmit={handleSubmitComment} className="comment-from">
                                <UserAvatar user={currentUser} size={32} />
                                <input 
                                    type="text"
                                    placeholder="Write a comment"
                                    className="task-detail-input"
                                    value={commentDraft}
                                    onChange={(event) => setCommentDraft(event.target.value)} 
                                />
                                <button type="submit" className="comment-send-button">
                                    Send {sendIco}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* Right column: Stage/Priority/Status/Assigned */}
                    <div className="task-detail-right">
                        <div className="modal-row">
                            <label>
                                Stage
                                <select value={stageId} onChange={handleStageChange}>
                                    {columns.map((column) => (
                                        <option key={column.id} value={column.id}>{column.title}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Priority
                                <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            Status
                            <select value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="Open">Open</option>
                                <option value="In Review">In Review</option>
                                <option value="Frozen">Frozen</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </label>
                    <div className="assigned-section">
                        <label>Assigned</label>
                        {assignedIds.length === 0 && <p className="assigned-empty">Unassigned</p>}
                        {assignedIds.map((userId) => {
                            const user = USERS.find((u) => u.id === userId);
                            if (!user) return null;
                            return (
                                <div key={userId} className="assigned-row">
                                    <UserAvatar user={user} size={28} />
                                    <span>{user.name}</span>
                                    <button type="button" className="assigned-remove" onClick={() => handleRemoveAssignee(userId)}>x</button>
                                </div>
                            );
                        })}
                        {isAddingUser ? (
                            <select 
                                autoFocus
                                value=""
                                onChange={(event) => { if (event.target.value) handleAddAssignee(event.target.value); }}
                                onBlur={() => setIsAddingUser(false)}
                            >
                                <option value="" disabled>Select user...</option>
                                {USERS.filter((user) => !assignedIds.includes(user.id)).map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        ) : (
                            <button type="button" className="add-user-button" onClick={() => setIsAddingUser(true)}>
                                + Add User
                            </button>
                        )}
                    </div>
                        
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={handleSave}>Save Changes</button>
                </div>
                {isDatePickerOpen && datePickerPosition && (
                    <DateTimePicker
                        value={dueDate}
                        position={datePickerPosition}
                        onClose={() => setIsDatePickerOpen(false)}
                        onApply={handleApplyDate}
                    />
                )}
            </div>
        </div>
    );
}
export default TaskDetailModal;