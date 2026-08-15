import { useState } from "react";

function TaskModal({columns, finalColumnId, onClose, onSubmit, initialStageId = null}) {

    const [title, setTitle] = useState("");
    const [stageId, setStageId] = useState(initialStageId ?? columns[0]?.id ?? "");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Open");
    const [dueDate, setDueDate] = useState("");

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
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Task</h3>
                    <button onClick={onClose}>x</button>
                </div>
                <p className="modal-subtitle">Fill in the details to create a new task"</p>

                <form onSubmit={handleSubmit}>
                    <div className="modal-row">
                        <label>
                        Title*
                        <input type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter task title"
                            autoFocus
                         />
                    </label>
                {columns.length > 0 &&(
                    <label>
                        Stage
                        <select value={stageId} onChange={handleStageChange}>
                            {columns.map((column) => (
                                <option key={column.id} value={column.id}>{column.title}</option>
                            ))}
                        </select>
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
                        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </label>

                        <label >
                        Status
                            <select value={status} onChange={handleStatusChange}>
                                <option value="Open">Open</option>
                                <option value="In Review">In Review</option>
                                <option value="Frozen">Frozen</option>
                            </select>
                        </label>
                    </div>
                    
                    <div className="modal-row">
                        <label>
                        Due Date
                        <input 
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                        />
                        </label>
                    </div>
                    

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;