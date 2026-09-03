import { useEffect, useState } from "react";
import { USERS } from "./users";
import Sidebar from "./components/Sidebar";
import ProjectBoard from "./components/ProjectBoard";
import ConfirmDialog from "./components/ConfirmDialog";
import TopBar from "./components/TopBar";
import RightPanel from "./components/RightPanel";
import { loadActivityLog, saveActivityLog, createActivityEntry } from "./activityLog";
import "./App.css";

function migrateLegacyProject() {
  const legacyColumns = localStorage.getItem("columns");
  const legacyTasks = localStorage.getItem("tasks");
  if (legacyColumns === null && legacyTasks === null) return null;

  const id = "project-1";
  if (legacyColumns !== null) {
    localStorage.setItem(`project-${id}-columns`, legacyColumns);
    localStorage.removeItem("columns");
  }
  if (legacyTasks !== null) {
    localStorage.setItem(`project-${id}-tasks`, legacyTasks);
    localStorage.removeItem("tasks");
  }
  return {id, name: "Project 1"};
}

function App () {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    if (saved) return JSON.parse(saved);

    const migrated = migrateLegacyProject();
    if (migrated) return [migrated];

    return [{id: crypto.randomUUID(), name: "Project 1"}];
  });
  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem("activeProjectId") || projects[0]?.id || null;
  });

  const [justCreatedProjectId, setJustCreatedProjectId] = useState(null);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem("activeProjectId", activeProjectId);
    }
  }, [activeProjectId]);

  function generateProjectName(existingNames) {
    let n = 1;
    while (existingNames.includes(`Project ${n}`)) {
      n += 1;
    }
    return `Project ${n}`;
  }

  const handleAddProject = () => {
    const newId = crypto.randomUUID();
    const newName = generateProjectName(projects.map((project) => project.name));
    setProjects([...projects, {id: newId, name: newName}]);
    setActiveProjectId(newId);
    setJustCreatedProjectId(newId);
  };

  const [activityLog, setActivityLog] = useState(() => loadActivityLog());
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUserId, setActiveUserId] = useState(USERS[0].id);

  useEffect(() => {
    saveActivityLog(activityLog);
  }, [activityLog]);

  const handleAddActivity = (activity) => {
    setActivityLog((prev) => [createActivityEntry(activeUserId, activity), ...prev].slice(0, 200));
  };

  const [highlightedTaskId, setHighlightedTaskId] = useState(null);

  const handleNavigateToTask = (projectId, taskId) => {
    if (projectId) setActiveProjectId(projectId);
    setHighlightedTaskId(taskId ?? null);
  };

  useEffect(() => {
    if (!highlightedTaskId) return;
    const timeout = setTimeout(() => setHighlightedTaskId(null), 1000);
    return () => clearTimeout(timeout);
   }, [highlightedTaskId]);

  const handleRenameProject = (projectId, newName) => {
    const project = projects.find((p) => p.id === projectId);
    setProjects(
      projects.map((project) => 
        project.id === projectId ? {...project, name: newName} : project
      )
    );
    if (project && project.name !== newName) {
      handleAddActivity({prefix: "renamed project", linkText: `"${project.name}"`, suffix: ` to "${newName}"`, projectId: project.id});
    }
  };

  const [projectPendingDeletion, setProjectPendingDeletion] = useState(null);

  const handleRequestDeleteProject = (projectId) => {
    setProjectPendingDeletion(projectId);
  }

  const handleConfirmDeleteProject = () => {
    handleDeleteProject(projectPendingDeletion);
    setProjectPendingDeletion(null);
  };

  const handleCancelDeleteProject = () => {
    setProjectPendingDeletion(null);
  }

  const projectToDelete = projects.find((project) => project.id === projectPendingDeletion) ?? null;

  const handleDeleteProject = (projectId) => {
    setProjects((prevProjects) => {
      const remaining = prevProjects.filter((project) => project.id !== projectId);
      return remaining.length > 0 ? remaining : [{id: crypto.randomUUID(), name: 
      generateProjectName([]) }];
      });
      localStorage.removeItem(`project-${projectId}-columns`);
      localStorage.removeItem(`project-${projectId}-tasks`);
      setActiveProjectId((prevActiveId) =>
      prevActiveId === projectId ? null : prevActiveId
      );
    };
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  return (
    <>
      <div className="app-shell">
      {!isSidebarCollapsed && (
        <Sidebar
          projects={projects}
          activeProjectId={activeProject?.id ?? null}
          justCreatedProjectId={justCreatedProjectId}
          onSelectProject={setActiveProjectId}
          onAddProject={handleAddProject}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleRequestDeleteProject}
        />
      )}
        
        <div className="app-body">
          <TopBar
            projectName={activeProject?.name ?? ""}
            activeUserId={activeUserId}
            onSelectUser={setActiveUserId}
            onToggleRightPanel={() => setIsRightPanelCollapsed((collapsed) => !collapsed)}
            onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {activeProject && (
          <ProjectBoard
            key={activeProject.id}
            projectId={activeProject.id}
            projectName={activeProject.name}
            activeUserId={activeUserId}
            onAddActivity={handleAddActivity}
            highlightedTaskId={highlightedTaskId}
            searchQuery={searchQuery}
          />
          )}
        </div>
        <RightPanel 
          activityLog={activityLog}
          isCollapsed={isRightPanelCollapsed}
          activeUserId={activeUserId}
          onSelectUser={setActiveUserId} 
          onNavigateToTask={handleNavigateToTask} 
        />
        {projectToDelete && (
          <ConfirmDialog
            title="Delete project?"
            message={`This will permanently delete "${projectToDelete.name}" and all of its tasks. This can't be undone.`}
            confirmLabel="Delete project"
            onConfirm={handleConfirmDeleteProject}
            onCancel={handleCancelDeleteProject}
          />
        )}
      </div>
    </>
  );
}

export default App;