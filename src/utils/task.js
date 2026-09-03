export function getDisplayPriority(task) {
    return task.status === "Frozen" ? "Frozen" : task.priority;
}

export function formatDueDate(dueDate) {
    if (!dueDate) return null;
    const hasTime = dueDate.includes("T");
    const date = hasTime ? new Date(dueDate) : new Date(`${dueDate}T00:00:00`);
    const weekday = date.toLocaleDateString(undefined, {weekday: "short"});
    const month = date.toLocaleDateString(undefined, {month: "short"});
    if (!hasTime) {
        return `${weekday}, ${month}. ${date.getDate()}`;
    }
    const time = date.toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
    return `${weekday}, ${month}. ${date.getDate()} · ${time}`;
}

export function formatTimestamp(isoString) {
    if (!isoString) return null;
    const date = new Date(isoString);
    const weekday = date.toLocaleDateString(undefined, {weekday: "short"});
    const month = date.toLocaleDateString(undefined, {month: "short"});
    const time = date.toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
    return `${weekday}, ${month}. ${date.getDate()} · ${time}`;
}

export function autoResizeTextarea(element) {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`
}