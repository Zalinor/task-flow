export function loadActivityLog() {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [];
}

export function saveActivityLog(entries) {
    localStorage.setItem("activityLog", JSON.stringify(entries));
}

export function createActivityEntry(userId, message) {
    return {
        id: crypto.randomUUID(),
        userId,
        message,
        createdAt: new Date().toISOString(),
    };
}