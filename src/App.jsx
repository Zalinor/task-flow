import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ProjectBoard from "./components/ProjectBoard";
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


  const handleRenameProject = (projectId, newName) => {
    setProjects(
      projects.map((project) => 
        project.id === projectId ? {...project, name: newName} : project
      )
    );
  };

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
    <div className="app-shell">
      <Sidebar
        projects={projects}
        activeProjectId={activeProject?.id ?? null}
        justCreatedProjectId={justCreatedProjectId}
        onSelectProject={setActiveProjectId}
        onAddProject={handleAddProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
      />
      {activeProject && (
        <ProjectBoard
          key={activeProject.id}
          projectId={activeProject.id}
          projectName={activeProject.name}
        />
      )}
    </div>
  );
}

export default App;