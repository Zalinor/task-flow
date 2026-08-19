import { useEffect, useRef, useState } from "react";
import { USERS, getInitials } from "../users";

function UserSwitcher({activeUserId, onSelectUser}) {
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
        <div className="sidebar-workspace user-switcher" ref={wrapperRef}>
                <span className="sidebar-avatar" style={{backgroundColor: activeUser.color}}>
                    {getInitials(activeUser.name)}
                </span>
                <div>
                    <button type="button" className="sidebar-workspace-name" onClick={() => setIsOpen((open) => !open)}>
                        {activeUser.name} <span className="chevron"></span>⌄</button>
                    <p className="sidebar-syncing">Acting as {activeUser.name}</p>
                </div>
                {isOpen && (
                    <div className="user-switcher-dropdown">
                        {USERS.map((user) => (
                            <button
                                type="button"
                                key={user.id}
                                className={`user-switcher-option ${user.id === activeUserId ? "active" : ""}`}
                                onClick={() => handleSelect(user.id)}
                            >
                                <span className="sidebar-avatar sidebar-avatar-small" style={{backgroundColor: user.color}}>
                                    {getInitials(user.name)}
                                </span>
                                {user.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
    );
}

function ProjectListItem({project, isActive, shouldAutoEdit, onSelect, onRename, onDelete}) {
    const [isEditing, setIsEditing] = useState(shouldAutoEdit);
    const [draftName, setDraftName] = useState(project.name ?? "");

    const handleStartEditing = (event) => {
        event.stopPropagation(); 
        setDraftName(project.name ?? "");
        setIsEditing(true);
    };

    const handleFinishEditing = () => {
        const trimmed = draftName.trim();
        if (trimmed !== "" && trimmed !== project.name) {
            onRename(project.id, trimmed);
        }
        setIsEditing(false);
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        onDelete(project.id);
    };

    return (
        <div 
            className={`sidebar-project-row ${isActive ? "active" : ""}`}
            onClick={() => onSelect(project.id)}   
        >
            <span className="sidebar-project-icon">▢</span>
            {isEditing ? (
                <input 
                    type="text"
                    className="sidebar-project-input"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    onBlur={handleFinishEditing}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") event.target.blur();
                    }}
                    onClick={(event) => event.stopPropagation()}
                    autoFocus
                />
            ) : (
                <span className="sidebar-project-name">
                    {project.name || "Untitled project"}
                    <button  type="button" className="sidebar-project-rename" onClick={handleStartEditing}>
                        ✎
                    </button>
                </span>
            )}
            <button type="button" className="sidebar-project-delete" onClick={handleDeleteClick}>🗑</button>
        </div>
    );
}

function Sidebar({projects, activeProjectId, justCreatedProjectId, activeUserId, onSelectUser, onSelectProject, onAddProject, onRenameProject, onDeleteProject}) {
    return (
        <aside className="sidebar">
            <UserSwitcher activeUserId={activeUserId} onSelectUser={onSelectUser}/>

            {/* Stub items - no logic yet */}
            <nav className="sidebar-nav">
                <button type="button" className="sidebar-nav-item">🏠 Home</button>
                <button type="button" className="sidebar-nav-item">✉ Inbox</button>
                <button type="button" className="sidebar-nav-item">👥 Members</button>
            </nav>

            <div className="sidebar-section">
                <p className="sidebar-section-title">Workspace <span className="chevron">⌄</span></p>
                <p className="sidebar-company">
                    <span className="sidebar-avatar sidebar-avatar-small">C</span>Company, Inc <span className="chevron">⌄</span>
                </p>

                <div className="sidebar-projects">
                    {projects.map((project) => (
                        <ProjectListItem
                            key={project.id}
                            project={project}
                            isActive={project.id === activeProjectId}
                            shouldAutoEdit={project.id === justCreatedProjectId}
                            onSelect={onSelectProject}
                            onRename={onRenameProject}
                            onDelete={onDeleteProject}
                        />
                    ))}
                    <button type="button" className="sidebar-add-project" onClick={onAddProject}>
                        + Add
                    </button>
                </div>

                {/* Decorative placeholders matching the mockup - not real workspaces */}
                <div className="sidebar-stub-list">
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                </div>

                <button type="button" className="sidebar-nav-item">📅 Calendar</button>
            </div>

            <div className="sidebar-section">
                <p className="sidebar-section-title">Your channels <span className="chevron">⌄</span></p>
                <button type="button" className="sidebar-nav-item"># Design ›</button>
                <button type="button" className="sidebar-nav-item"># Marketing ›</button>
            </div>

            <div className="sidebar-footer">
                <p className="sidebar-trial">There are <strong>6 days</strong> left in your trial.</p>
                <button type="button" className="sidebar-upgrade">Upgrade</button>
                <button type="button" className="sidebar-nav-item">⚙ Settings</button>
                <button type="button" className="sidebar-nav-item">? Help &amp; support</button>
            </div>
        </aside>
    )
}

export default Sidebar;
