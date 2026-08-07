import { useEffect, useRef } from "react";

function TaskMenu({onEdit, onDelete, onClose, showEdit = true}) {
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
        <div className="task-menu" ref={menuRef}>
            {showEdit && <button onClick={onEdit}>Edit Task</button>}
            <button onClick={onDelete} className="task-menu-delete">Delete</button>
        </div>
    );
}

export default TaskMenu;