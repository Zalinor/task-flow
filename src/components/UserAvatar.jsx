function UserAvatar({ user, size = 28, className = ""}) {
    if (!user) return null;

    if (user.avatar) {
        return (
            <img 
                src={user.avatar} 
                alt={user.name}
                title={user.name}
                className={`user-avatar-img ${className}`}
                style={{width: size, height: size}}
            />
        );
    }

    return (
        <span
            className={`user-avatar-fallback ${className}`}
            style={{width: size, height: size, backgroundColor: user.color}}
            title={user.name}
        >
            {user.name.split(" ").map((p) => p[0]).join("").slice(0,2).toUpperCase()}
        </span>
    );
}

export default UserAvatar;