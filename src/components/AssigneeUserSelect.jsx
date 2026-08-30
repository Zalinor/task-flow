import { useEffect, useRef, useState } from "react";
import { USERS } from "../users";
import UserAvatar from "./UserAvatar";
import AvatarStack from "./AvatarStack";
import { chevronIco, userFilter } from "../icons";

function AssignedUserSelect({ assignedIds, onToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);

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

    const handleToggleOpen = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const estimatedHeight = 260;
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;
            setDropdownPosition({
                top: openUpward ? rect.top - 4 : rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                openUpward,
            });
        }
        setIsOpen((open) => !open);
    };

    return (
        <div className="assignee-filter" ref={wrapperRef}>
            <button type="button" ref={triggerRef} className="assignee-user-button" onClick={handleToggleOpen}>
                <AvatarStack userIds={assignedIds} size={30} max={3} emptyIcon={userFilter} />
                {assignedIds.length === 0 && <span className="assignee-placeholder">User</span>}
                <span className={`chevron ${isOpen ? "" : "closed"}`}>{chevronIco}</span>
            </button>
            {isOpen && dropdownPosition && (
                <div className="assignee-filter-dropdown" 
                    style={{
                        position: "fixed",
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        transform: dropdownPosition.openUpward ? "translateY(-100%)" : "none",
                    }}
                >
                    {USERS.map((user) => (
                        <button
                            type="button"
                            className={`assignee-filter-option ${assignedIds.includes(user.id) ? "active" : ""}`}
                            key={user.id}
                            onClick={() => onToggle(user.id)}
                        >
                            <UserAvatar user={user} size={22} />
                            {user.name}
                            {assignedIds.includes(user.id) && <span className="assignee-filter-check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AssignedUserSelect;