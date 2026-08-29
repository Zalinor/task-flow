import { useEffect, useRef, useState } from "react";
import { USERS } from "../users";
import UserAvatar from "./UserAvatar";
import AvatarStack from "./AvatarStack";

function AssigneeFilterButton({ selectedValues, onToggle, onClear}) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // const handleSelect = (value) => {
    //     onSelect(value);
    //     setIsOpen(false);
    // };

    return (
        <div className="assignee-filter" ref={wrapperRef}>
            <button type="button" className="assignee-filter-button" onClick={()=> setIsOpen((open) => !open)}>
                <AvatarStack userIds={USERS.map((user) => user.id)} size={30} max={3}/>
            </button>
            {isOpen && (
                <div className="assignee-filter-dropdown">
                    <button 
                        type="button"
                        className={`assignee-filter-option ${selectedValues.length === 0 ? "active" : ""}`}
                        onClick={onClear}
                    >
                        All assignees
                    </button>
                    <label className="assignee-filter-option">
                        <button 
                            type="button"
                            className={`assignee-filter-option ${selectedValues.includes("unassigned") ? "active" : ""}`} 
                            onClick={() => onToggle("unassigned")}
                        />
                        Unassigned
                        {selectedValues.includes("unassigned") && <span className="assignee-filter-check">✓</span>}
                    </label>
                    {USERS.map((user) => (
                        <button
                            type="button"
                            className={`assignee-filter-option ${selectedValues.includes(user.id) ? "active" : ""}`}
                            key={user.id}
                            onClick={() => onToggle(user.id)}
                        >
                            <UserAvatar user={user} size={22} />
                            {user.name}
                            {selectedValues.includes(user.id) && <span className="assignee-filter-check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AssigneeFilterButton;