import { useState } from "react";
import TaskMenu from "./TaskMenu";

function formatDueDate(dueDate) {
    if (!dueDate) return null; 
    const [year, month, day] = dueDate.split("-");
    return `${month}/${day}`;
}

function formatUpdatedAt(isoString) {
    if (!isoString) return null;
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
}

function TaskDetailModal({task, columns, finalColumnId, onClose, onSave, onAddComment, onDelete, onEdit}) {
    const [stageId, setStageId] = useState(task.columnId);
    const [priority, setPriority] = useState(task.priority ?? "Medium");
    const [status, setStatus] = useState(task.status ?? "Open");
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(task.dueDate ?? "");

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.text);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);

    const [commentDraft, setCommentDraft] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const comments = task.comments ?? [];

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
    const formattedUpdatedAt = formatUpdatedAt(task.updatedAt);

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
                                ✎
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

                        <div className="task-detail-field">
                            <label>
                                Due Date
                                <button
                                    type="button"
                                    className="pencil-button"
                                    onClick={() => setIsEditingDueDate((open) => !open)}
                                >
                                    ✎
                                    </button>
                            </label>
                            {isEditingDueDate ? (
                                <input 
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                    onBlur={() => setIsEditingDueDate(false)}
                                    autoFocus    
                                />
                            ) : (
                                <p>{formattedDueDate ?? "No due date"}</p>
                            )}
                        </div>

                        <p className="task-detail-updated">
                            Updated {formattedUpdatedAt ?? "-"}
                        </p>

                        <div className="task-detail-comments">
                            <label>Comments</label>
                            <div className="comments-list">
                                {comments.length === 0 && <p className="no-comments">No comments yet</p>}
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-avatar"/>
                                        <div>
                                            <p className="comment-meta">
                                                <strong>{comment.author}</strong>{formatUpdatedAt(comment.createdAt)}
                                            </p>
                                            <p className="comment-text">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSubmitComment} className="comment-from">
                                <input 
                                    type="text"
                                    placeholder="Write a comment"
                                    className="task-detail-input"
                                    value={commentDraft}
                                    onChange={(event) => setCommentDraft(event.target.value)} 
                                />
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

                        <label>
                            Assigned
                            {/*Temporary placeholder*/}
                            <select disabled defaultValue="user">
                                <option value="User">User</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
export default TaskDetailModal;