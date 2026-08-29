import { useEffect, useRef, useState } from "react";
import { USERS } from "../users";
import UserAvatar from "./UserAvatar";
import { chevronIco } from "../icons";

function UserSwitcher({activeUserId, onSelectUser, compact = false}) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const activeUser = USERS.find((user) => user.id === activeUserId) ?? USERS[0];

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

    const handleSelect = (userId) => {
        onSelectUser(userId);
        setIsOpen(false);
    };

    return (
        <div className={`user-switcher ${compact ? "user-switcher-compact" : "sidebar-workspace"}`} ref={wrapperRef}>
                <UserAvatar user={activeUser} size={40} className="sidebar-avatar" />
                {compact ? (
                    <button type="button" className="user-switcher-compact-name" onClick={() => setIsOpen((open) => !open)}>
                        {activeUser.name} <span className={`chevron ${isOpen ? "" : "closed"}`}>{chevronIco}</span>
                    </button>
                ) : (
                    <div>
                        <button type="button" className="sidebar-workspace-name" onClick={() => setIsOpen((open) => !open)}>
                        {activeUser.name} <span className={`chevron ${isOpen ? "" : "closed"}`}>{chevronIco}</span></button>
                        <p className="sidebar-syncing">Acting as {activeUser.name}</p>
                    </div>
                )}
                {isOpen && (
                    <div className="user-switcher-dropdown">
                        {USERS.map((user) => (
                            <button
                                type="button"
                                key={user.id}
                                className={`user-switcher-option ${user.id === activeUserId ? "active" : ""}`}
                                onClick={() => handleSelect(user.id)}
                            >
                                <UserAvatar user={user} size={28} />
                                {user.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
    );
}

export default UserSwitcher;