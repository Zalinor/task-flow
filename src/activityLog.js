export function loadActivityLog() {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [];
}

export function saveActivityLog(entries) {
    localStorage.setItem("activityLog", JSON.stringify(entries));
}

export function createActivityEntry(userId, {prefix, linkText, suffix = "", taskId = null, projectId = null}) {
    return {
        id: crypto.randomUUID(),
        userId,
        prefix,
        linkText,
        suffix,
        taskId,
        projectId,
        createdAt: new Date().toISOString(),
    };
}