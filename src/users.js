export const USERS = [
    { id: "u1", name: "Alex Morgan", color: "#6c8cff" },
    { id: "u2", name: "Jordan Lee", color: "#f5a623" },
    { id: "u3", name: "Sam Rivera", color: "#2ea043" },
    { id: "u4", name: "Taylor Kim", color: "#e5484d" },
];

export function getUserById(userId) {
    return USERS.find((user) => user.id === userId) ?? null;
}

export function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}