function EmptyState({onAddTask}) {
    return(
        <div className="empty-state">
            <p>No tasks yet. Create your first task to get started!</p>
            <button className="task-button" onClick={onAddTask}>
                + Add Your First Task
            </button>
        </div>
    );
}

export default EmptyState;