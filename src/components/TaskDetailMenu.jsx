import { useEffect, useRef } from "react";

function TaskDetailMenu({ onDelete, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="task-detail-menu" ref={menuRef}>
            <button type="button" className="task-detail-menu-item" disabled>Share</button>
            <button type="button" className="task-detail-menu-item" disabled>Export</button>
            <button type="button" className="task-detail-menu-item" disabled>Clone</button>
            <button type="button" className="task-detail-menu-item task-detail-menu-item-delete" onClick={onDelete}>Delete</button>
        </div>
    );
}

export default TaskDetailMenu;