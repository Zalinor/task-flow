import { useState } from "react";

function ProjectListItem({project, isActive, shouldAutoEdit, onSelect, onRename}) {
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
        </div>
    );
}

function Sidebar({projects, activeProjectId, justCreatedProjectId, onSelectProject, onAddProject, onRenameProject}) {
    return (
        <aside className="sidebar">
            <div className="sidebar-workspace">
                <span className="sidebar-avatar">A</span>
                <div>
                    <p className="sidebar-workspace-name">Agency <span className="chevron"></span>⌄</p>
                    <p className="sidebar-syncing">↻ Syncing up</p>
                </div>
            </div>

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
                            project={projects}
                            isActive={project.id === activeProjectId}
                            shouldAutoEdit={project.id === justCreatedProjectId}
                            onSelect={onSelectProject}
                            onRename={onRenameProject}
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
