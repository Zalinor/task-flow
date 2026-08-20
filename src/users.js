import avatarAva from './assets/avatars/avaBennett.jpg';
import avatarCaleb from './assets/avatars/calebTurner.jpg';
import avatarOlivia from './assets/avatars/oliviaRhye.jpg';
import avatarSofia from './assets/avatars/sofiaHayes.jpg';
import avatarVictor from './assets/avatars/victorAmaro.jpg';

export const USERS = [
    { id: "u1", name: "Ava Bennett", color: "#6c8cff", avatar: avatarAva },
    { id: "u2", name: "Caleb Turner", color: "#f5a623", avatar: avatarCaleb },
    { id: "u3", name: "Olivia Rhye", color: "#2ea043", avatar: avatarOlivia },
    { id: "u4", name: "Sofia Hayes", color: "#e5484d", avatar: avatarSofia },
    { id: "u5", name: "Victor Amaro", color: "#25989c", avatar: avatarVictor },
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

export function normalizeAssignees(assignedTo) {
    if (Array.isArray(assignedTo)) return assignedTo;
    if (assignedTo) return [assignedTo];
    return [];
}