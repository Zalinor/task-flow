import { USERS } from "../users";
import UserAvatar from "./UserAvatar";

function AvatarStack({ userIds, size = 30, max = 3, emptyIcon = null}) {
    const users = userIds.map((id) => USERS.find((user) => user.id === id)).filter(Boolean);

    if (users.length === 0) {
        return emptyIcon;
    }

    const visible = users.slice(0, max);
    const overflow = users.length - visible.length;

    return (
        <span className="avatar-stack">
            {visible.map((user) => (
                <UserAvatar key={user.id} user={user} size={size} className="avatar-stack-item"/>
            ))}
            {overflow > 0 && (
                <span className="avatar-stack-overflow" style={{width: size, height: size}}>
                    +{overflow}
                </span>
            )}
        </span>
    );
}

export default AvatarStack;