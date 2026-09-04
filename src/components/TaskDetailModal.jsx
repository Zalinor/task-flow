import { useEffect, useRef, useState } from "react";
import { USERS, normalizeAssignees, getUserById } from "../users";
import UserAvatar from "./UserAvatar";
import { sendIco, pencilIco, crossIco, ellipsisIco, subtaskRemove, unionIco, addUserUnionIco, chevronIco } from "../icons"
import DateTimePicker from "./DateTimePicker";
import TaskDetailMenu from "./TaskDetailMenu";
import { formatDueDate, formatTimestamp, autoResizeTextarea } from "../utils/task";
import CustomSelect from "./CustomSelect";

function TaskDetailModal({task, columns, finalColumnId, currentUser, onClose, onSave, onAddComment, onDelete, onEdit}) {
    
    const [stageId, setStageId] = useState(task.columnId);
    const [priority, setPriority] = useState(task.priority ?? "Medium");
    const [status, setStatus] = useState(task.status ?? "Open");
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(task.dueDate ?? "");
    const [subtasks, setSubtasks] = useState(task.subtasks ?? []);
    const [subtaskDraft, setSubtaskDraft] = useState("");
    const [editingSubtaskId, setEditingSubtaskId] = useState(null);
    const [editingSubtaskDraft, setEditingSubtaskDraft] = useState("");
    const editingSubtaskRef = useRef(null);
    const [isSubtasksOpen, setIsSubtasksOpen] = useState(true);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.text);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const titleTextareaRef = useRef(null);
    const descriptionTextareaRef = useRef(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerPosition, setDatePickerPosition] = useState(null);
    const dueDateFieldRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (editingSubtaskId !== null) autoResizeTextarea(editingSubtaskRef.current);
    }, [editingSubtaskId]);

    const handleStartEditSubtask = (subtask) => {
        setEditingSubtaskDraft(subtask.text);
        setEditingSubtaskId(subtask.id);
    };

    const handleFinishEditSubtask = () => {
        const trimmed = editingSubtaskDraft.trim();
        if (trimmed !== "") {
            setSubtasks((prev) => prev.map((s) => (s.id === editingSubtaskId ? { ...s, text: trimmed } : s)));
        }
        setEditingSubtaskId(null);
    };

    useEffect(() => {
        if (isEditingTitle) autoResizeTextarea(titleTextareaRef.current);
    }, [isEditingTitle]);

    useEffect(() => {
        if (isEditingDescription) autoResizeTextarea(descriptionTextareaRef.current);
    }, [isEditingDescription]);

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

    const comments = task.comments ?? [];

    const handleAddAssignee = (userId) => {
        setAssignedIds((prev) => [...prev, userId]);
        setIsAddingUser(false);
    };

    const handleRemoveAssignee = (userId) => {
        setAssignedIds((prev) => prev.filter((id) => id !== userId));
    }

    const handleStageChange = (newStageId) => {
        setStageId(newStageId);
        if (finalColumnId && newStageId === finalColumnId) {
            setStatus("Completed");
        }
    }

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        if (newStatus === "Completed" && finalColumnId) {
            setStageId(finalColumnId);
        }
    }

    const handleAddSubtask = () => {
        const trimmed = subtaskDraft.trim();
        if (trimmed === "") return;
        setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }]);
        setSubtaskDraft("");
    };

    const handleRemoveSubtask = (subtaskId) => {
        setSubtasks((prev) => prev.filter((subtask) => subtask.id !== subtaskId));
    };

    const handleToggleSubtask = (subtaskId) => {
        setSubtasks((prev) => prev.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        ));
    };

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
            subtasks,
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
                <div className="modal-header task-detail-header">
                    <div className="modal-header-actions-group">
                        <div className="task-detail-menu-wrapper">
                            <button
                                type="button"
                                className={`task-detail-delete-button ${isMenuOpen ? "active" : ""}`}
                                onClick={() => setIsMenuOpen((open) => !open)}
                            >
                                {ellipsisIco}
                            </button>
                            {isMenuOpen && (
                                <TaskDetailMenu
                                    onDelete={() => { setIsMenuOpen(false); onDelete(task.id); }}
                                    onClose={() => setIsMenuOpen(false)}
                                />
                            )}
                        </div>
                        <button className="modal-header-button" onClick={onClose}>{crossIco}</button>
                    </div>
                </div>

                <div className="task-detail-body">
                    <div className="task-detail-left">
                        <div className="task-detail-field">
                            {isEditingTitle ? (
                                <textarea
                                    ref={titleTextareaRef}
                                    className="task-detail-title-input"
                                    value={draftTitle}
                                    maxLength={255}
                                    onChange={(event) => { setDraftTitle(event.target.value); autoResizeTextarea(event.target); }}
                                    onBlur={handleFinishEditingTitle}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") { event.preventDefault(); event.target.blur(); }
                                    }}
                                    autoFocus
                                    rows={1}
                                />
                            ) : (
                                <h3 className="task-detail-title-text" onClick={handleStartEditingTitle}>{task.text}</h3>
                            )}
                        </div>

                            <p className="task-detail-updated">
                            Updated {formattedUpdatedAt ?? "-"}
                        </p>

                        <div className="task-detail-field">
                            <label>
                                Description
                            </label>
                            {isEditingDescription ? (
                                <textarea
                                    ref={descriptionTextareaRef}
                                    value={description}
                                    onChange={(event) => { setDescription(event.target.value); autoResizeTextarea(event.target); }}
                                    onBlur={() => setIsEditingDescription(false)}
                                    autoFocus
                                />
                            ) : (
                                <p
                                    className="task-detail-description-text task-detail-editable-text"
                                    onClick={() => setIsEditingDescription(true)}
                                >
                                    {description || "No description"}
                                </p>
                            )}
                        </div>
                        <div className="subtask-container">
                            <div className="task-detail-subtasks">
                                <button
                                    type="button"
                                    className="task-detail-subtasks-toggle"
                                    onClick={() => setIsSubtasksOpen((open) => !open)}
                                >
                                    Subtasks
                                    {subtasks.length > 0 && (
                                        <span className="subtasks-progress">{subtasks.filter((s) => s.completed).length} of {subtasks.length}</span>
                                    )}
                                    <span className={`chevron ${isSubtasksOpen ? "" : "closed"}`}>{chevronIco}</span>
                                </button>
                                {isSubtasksOpen && subtasks.length > 0 && (
                                    <div className="subtasks-list">
                                        {subtasks.map((subtask) => (
                                            <div key={subtask.id} className="subtask-row">
                                                <label className="subtask-checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={subtask.completed}
                                                        onChange={() => handleToggleSubtask(subtask.id)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                {editingSubtaskId === subtask.id ? (
                                                    <textarea
                                                        ref={editingSubtaskRef}
                                                        className="subtask-row-textarea"
                                                        value={editingSubtaskDraft}
                                                        maxLength={255}
                                                        onChange={(event) => { setEditingSubtaskDraft(event.target.value); autoResizeTextarea(event.target); }}
                                                        onBlur={handleFinishEditSubtask}
                                                        onKeyDown={(event) => {
                                                            if (event.key === "Enter") { event.preventDefault(); event.target.blur(); }
                                                        }}
                                                        autoFocus
                                                        rows={1}
                                                    />
                                                ) : (
                                                    <span
                                                        className={`subtask-row-text task-detail-editable-text ${subtask.completed ? "subtask-done-text" : ""}`}
                                                        onClick={() => handleStartEditSubtask(subtask)}
                                                    >
                                                        {subtask.text}
                                                    </span>
                                                )}
                                                <button type="button" className="subtask-remove" onClick={() => handleRemoveSubtask(subtask.id)}>{subtaskRemove}</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="subtask-input-row">
                                    <input
                                        type="text"
                                        placeholder="Enter subtask title"
                                        maxLength={255}
                                        value={subtaskDraft}
                                        onChange={(event) => setSubtaskDraft(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                handleAddSubtask();
                                            }
                                        }}
                                    />
                                    <button type="button" className="subtask-add-button" onClick={handleAddSubtask}>{unionIco} Add</button>
                                </div>
                            </div>
                        </div>

                        <div className="task-detail-comments">
                            <label>Comments</label>
                            <div className="comments-list">
                                {comments.length === 0 && <p className="no-comments">No comments yet</p>}
                                {comments.map((comment) => {
                                    const commentUser = getUserById(comment.authorId);
                                    return (
                                        <div key={comment.id} className="comment">
                                            <UserAvatar user={commentUser} size={30} className="comment-avatar" />
                                            <div className="comment-body">
                                                <p className="comment-meta">
                                                    <strong>{comment.author}</strong> 
                                                    <span>{formatTimestamp(comment.createdAt)}</span>
                                                </p>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <form onSubmit={handleSubmitComment} className="comment-from">
                                <UserAvatar user={currentUser} size={30} className="comment-avatar" />
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

                    <div className="task-detail-right">
                        <div className="modal-row">
                            <label>
                                Stage
                                <CustomSelect
                                    value={stageId}
                                    onChange={handleStageChange}
                                    options={columns.map((column) => ({ value: column.id, label: column.title }))}
                                />
                            </label>
                            <label>
                                Priority
                                <CustomSelect
                                    value={priority}
                                    onChange={setPriority}
                                    options={[
                                        { value: "High", label: "High" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "Low", label: "Low" },
                                    ]}
                                />
                            </label>
                        </div>

                        <label>
                            Status
                            <CustomSelect
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { value: "Open", label: "Open" },
                                    { value: "In Review", label: "In Review" },
                                    { value: "Frozen", label: "Frozen" },
                                    { value: "Completed", label: "Completed" },
                                ]}
                            />
                        </label>
                        <div className="task-detail-field" ref={dueDateFieldRef}>
                            <label>
                                Due Date
                            </label>
                            <p onClick={handleOpenDatePicker} style={{cursor: "pointer"}}>
                                {formattedDueDate ?? "No due date"}
                                <button
                                    type="button"
                                    className="pencil-button"
                                    onClick={handleOpenDatePicker}
                                >
                                    {pencilIco}
                                </button>
                            </p>
                        </div>
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
                                        <button type="button" className="assigned-remove" onClick={() => handleRemoveAssignee(userId)}>{crossIco}</button>
                                    </div>
                                );
                            })}
                            {isAddingUser ? (
                                <CustomSelect
                                    value=""
                                    placeholder="Select user..."
                                    onChange={(userId) => { handleAddAssignee(userId); setIsAddingUser(false); }}
                                    options={USERS.filter((user) => !assignedIds.includes(user.id)).map((user) => ({ value: user.id, label: user.name }))}
                                />
                            ) : (
                                <button type="button" className="add-user-button" onClick={() => setIsAddingUser(true)}>
                                    {addUserUnionIco} Add User
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit" onClick={handleSave}>Save Changes</button>
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