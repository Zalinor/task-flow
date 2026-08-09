export function getDisplayPriority(task) {
    return task.status === "Frozen" ? "Frozen" : task.priority;
}