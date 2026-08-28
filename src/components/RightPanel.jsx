import UserSwitcher from "./UserSwitcher";
import { useState } from "react";
import { USERS, getUserById } from "../users";
import UserAvatar from "./UserAvatar";
import { boltIco, peopleIco, chevronIco } from "../icons";

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMin = Math.round((now - date) / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return `Today, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function CollapsibleSection({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="right-panel-section">
      <button type="button" className="right-panel-section-header" onClick={() => setIsOpen((open) => !open)}>
        <span className="section-header-title">{icon} {title}</span>
       <span className={`chevron ${isOpen ? "open" : ""}`}>{chevronIco}</span>
      </button>
      {isOpen && <div className="right-panel-section-body">{children}</div>}
    </div>
  );
}

function RightPanel({ activityLog, isCollapsed, activeUserId, onSelectUser, onNavigateToTask }) {
  if (isCollapsed) return null;

  return (
    <aside className="right-panel">
      <UserSwitcher activeUserId={activeUserId} onSelectUser={onSelectUser} compact />
      <CollapsibleSection title="Activities" icon={boltIco}>
      <div className="activity-list">
        {activityLog.length === 0 && <p className="activity-empty">No activity yet</p>}
        {activityLog.map((entry) => {
          const user = getUserById(entry.userId);
          return (
            <div key={entry.id} className="activity-row">
              <UserAvatar user={user} size={28} />
              <div>
                <p className="activity-message">
                  <strong>{user?.name ?? "Someone"}</strong> {" "}
                  {entry.message ? (
                    entry.message
                  ) : (
                    <>
                      {entry.prefix}{" "}
                      {entry.taskId ? (
                        <button 
                          type="button"
                          className="activity-link"
                          onClick={() => onNavigateToTask(entry.projectId, entry.taskId)}
                        >
                          {entry.linkText}
                        </button>
                      ) : (
                        entry.linkText
                      )}
                      {entry.suffix}
                    </>
                  )}
                </p>
                <p className="activity-time">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
          );
        })}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Team" icon={peopleIco}>
        <div className="team-list">
          {USERS.map((user) => (
            <div key={user.id} className="team-list-row">
              <UserAvatar user={user} size={32} />
              <div>
                <p className="team-list-name">{user.name}</p>
                <p className="team-list-role">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </aside>
  );
}

export default RightPanel;