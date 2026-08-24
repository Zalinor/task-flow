import { useState } from "react";

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

function Sidebar({projects, activeProjectId, justCreatedProjectId, onSelectProject, onAddProject, onRenameProject, onDeleteProject}) {
    const [isSupportCardVisible, setIsSupportCardVisible] = useState(true);

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <p className="sidebar-section-title-plain">Main menu</p>
                <nav className="sidebar-nav">
                    <button type="button" className="sidebar-nav-item">🏠 Home</button>
                    <button type="button" className="sidebar-nav-item">✉ Inbox</button>
                    <button type="button" className="sidebar-nav-item">📊 Reports</button>
                    <button type="button" className="sidebar-nav-item">⚙ Settings</button>
                </nav>
            </div>

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

                <div className="sidebar-stub-list">
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                    <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                </div>
            </div>

            {isSupportCardVisible && (
                <div className="sidebar-support-card">
                    <button type="button" className="sidebar-support-close" onClick={() => setIsSupportCardVisible(false)}>×</button>
                    <p className="sidebar-support-icon">🎧</p>
                    <p className="sidebar-support-title">Need support</p>
                    <p className="sidebar-support-text">Contact with one of our expert to get support.</p>
                    <button type="button" className="sidebar-support-button">Call the expert</button>
                </div>
            )}
        </aside>
    )
}

export default Sidebar;
