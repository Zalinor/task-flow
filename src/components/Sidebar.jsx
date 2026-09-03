import { useState } from "react";
import { homeIco, mailIco, reportsIco, settingsIco, chevronIco, kanbanIco, headphonesIco, pencilIco, crossIco, logoIco } from "../icons";

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
            {kanbanIco}
            {isEditing ? (
                <input 
                    type="text"
                    className="sidebar-project-input"
                    value={draftName}
                    maxLength={80}
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
                    <span className="sidebar-project-name-text">{project.name || "Untitled project"}</span>
                    <button  type="button" className="sidebar-project-rename" onClick={handleStartEditing}>
                        {pencilIco}
                    </button>
                </span>
            )}
            <button type="button" className="sidebar-project-delete" onClick={handleDeleteClick}>{crossIco}</button>
        </div>
    );
}

function Sidebar({projects, activeProjectId, justCreatedProjectId, onSelectProject, onAddProject, onRenameProject, onDeleteProject}) {
    const [isSupportCardVisible, setIsSupportCardVisible] = useState(true);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
    const [isCompanyOpen, setIsCompanyOpen] = useState(true);

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                 <div className="top-bar-logo">
                    {logoIco}
                </div>
            </div>

            <div className="sidebar-section">
                <p className="sidebar-section-title-plain">Main menu</p>
                <nav className="sidebar-nav">
                    <button type="button" className="sidebar-nav-item">{homeIco} Home</button>
                    <button type="button" className="sidebar-nav-item">{mailIco} Inbox</button>
                    <button type="button" className="sidebar-nav-item">{reportsIco} Reports</button>
                    <button type="button" className="sidebar-nav-item">{settingsIco} Settings</button>
                </nav>
                <button
                    type="button"
                    className="sidebar-section-title-plain sidebar-workspace sidebar-collapse-toggle"
                    onClick={() => setIsWorkspaceOpen((open) => !open)}
                >
                    Workspace <span className={`chevron ${isWorkspaceOpen ? "" : "closed"}`}>{chevronIco}</span>
                </button>

                {isWorkspaceOpen && (
                    <>
                        <button
                            type="button"
                            className="sidebar-company sidebar-collapse-toggle"
                            onClick={() => setIsCompanyOpen((open) => !open)}
                        >
                            <span className="sidebar-avatar sidebar-avatar-small">C</span>Company, Inc <span className={`chevron ${isCompanyOpen ? "" : "closed"}`}>{chevronIco}</span>
                        </button>

                        {isCompanyOpen && (
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
                        )}

                        <div className="sidebar-stub-list">
                            <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                            <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                            <p className="sidebar-company-stub"><span className="sidebar-avatar sidebar-avatar-small">C</span> Company, Inc</p>
                        </div>
                    </>
                )}
            </div>

            {isSupportCardVisible && (
                <div className="sidebar-support-card">
                    <button type="button" className="sidebar-support-close" onClick={() => setIsSupportCardVisible(false)}>{crossIco}</button>
                    <p className="sidebar-support-title">{headphonesIco} Need support</p>
                    <p className="sidebar-support-text">Contact with one of our expert to get support.</p>
                    <button type="button" className="sidebar-support-button">Call the expert</button>
                </div>
            )}
        </aside>
    )
}

export default Sidebar;
