import { useRef, useState } from "react";
import { calendarIco, crossIco, ellipsisIco } from "../icons";
import DateTimePicker from "./DateTimePicker";
import AssignedUserSelect from "./AssigneeUserSelect";
import CustomSelect from "./CustomSelect";
import { formatDueDate } from "../utils/task";

function TaskModal({columns, finalColumnId, onClose, onSubmit, initialStageId = null}) {

    const [title, setTitle] = useState("");
    const [stageId, setStageId] = useState(initialStageId ?? columns[0]?.id ?? "");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Open");
    const [dueDate, setDueDate] = useState("");
    const [assignedIds, setAssignedIds] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerPosition, setDatePickerPosition] = useState(null);
    const dueDateButtonRef = useRef(null);
    const availableColumns = columns.filter((column) => column.id !== finalColumnId);
    
    const [subtasks, setSubtasks] = useState([]);
    const [subtaskDraft, setSubtaskDraft] = useState("");

    const handleAddSubtask = () => {
        const trimmed = subtaskDraft.trim();
        if (trimmed === "") return;
        setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }]);
        setSubtaskDraft("");
    };

    const handleRemoveSubtask = (subtaskId) => {
        setSubtasks((prev) => prev.filter((subtask) => subtask.id !== subtaskId));
    };

    const handleToggleSubtaskDraft = (subtaskId) => {
        setSubtasks((prev) => prev.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        ));
    };

    const handleToggleAssignee = (userId) => {
        setAssignedIds((prev) => 
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        )
    }

    const handleOpenDatePicker = () => {
        if (dueDateButtonRef.current) {
            const rect = dueDateButtonRef.current.getBoundingClientRect();
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
        setDatePickerPosition(false);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;

        onSubmit({
            text: trimmedTitle,
            columnId: stageId,
            description: description.trim(),
            priority,
            status,
            dueDate,
            assignedTo: assignedIds,
            subtasks,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Task</h3>
                    <div className="modal-header-buttons">
                        <button className="modal-header-button">{ellipsisIco}</button>  
                        <button className="modal-header-button" onClick={onClose}>{crossIco}</button>
                    </div>
                    
                </div>
                <p className="modal-subtitle">Fill in the details to create a new task</p>

                <form onSubmit={handleSubmit} className="task-modal-form">
                    <div className="modal-row">
                        <label>
                        Title*
                        <input type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter task title"
                            maxLength={255}
                            autoFocus
                         />
                        </label>
                        {availableColumns.length > 0 &&(
                            <label>
                                Stage
                                <CustomSelect
                                    value={stageId}
                                    onChange={handleStageChange}
                                    options={availableColumns.map((column) => ({ value: column.id, label: column.title }))}
                                />
                            </label>
                        )}
                    </div>
                    

                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Enter task description (optional)"
                        /> 
                    </label>
                    <div className="modal-row">
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

                        <label >
                        Status
                            <CustomSelect
                                value={status}
                                onChange={handleStatusChange}
                                options={[
                                    { value: "Open", label: "Open" },
                                    { value: "In Review", label: "In Review" },
                                    { value: "Frozen", label: "Frozen" },
                                ]}
                            />
                        </label>
                    </div>
                    
                    <div className="modal-row">
                        <label>
                            Due Date
                            <button
                                type="button"
                                ref={dueDateButtonRef}
                                className={`due-date-trigger ${dueDate ? "has-value" : ""}`}
                                onClick={handleOpenDatePicker}
                            >
                                {calendarIco} {dueDate ? formatDueDate(dueDate) : "Pick a date (optional)"}
                            </button>
                        </label>
                        <label>
                            Assigned
                            <AssignedUserSelect assignedIds={assignedIds} onToggle={handleToggleAssignee}/>
                        </label>
                    </div>
                    

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={title.trim() === ""}>Add Task</button>
                    </div>
                    {isDatePickerOpen && datePickerPosition && (
                        <DateTimePicker
                            value={dueDate}
                            position={datePickerPosition}
                            onClose={() => setIsDatePickerOpen(false)}
                            onApply={handleApplyDate}
                        />
                    )}
                </form>
            </div>
        </div>
    );
}

export default TaskModal;