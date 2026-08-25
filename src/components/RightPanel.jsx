import { useState } from "react";
import { USERS, getUserById } from "../users";
import UserAvatar from "./UserAvatar";

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="right-panel-section">
      <button type="button" className="right-panel-section-header" onClick={() => setIsOpen((open) => !open)}>
        {title} <span className={`chevron ${isOpen ? "open" : ""}`}>⌄</span>
      </button>
      {isOpen && <div className="right-panel-section-body">{children}</div>}
    </div>
  );
}

function RightPanel({ activityLog, isCollapsed }) {
  if (isCollapsed) return null;

  return (
    <aside className="right-panel">
      <CollapsibleSection title="Activities">
      <div className="activity-list">
        {activityLog.length === 0 && <p className="activity-empty">No activity yet</p>}
        {activityLog.map((entry) => {
          const user = getUserById(entry.userId);
          return (
            <div key={entry.id} className="activity-row">
              <UserAvatar user={user} size={28} />
              <div>
                <p className="activity-message">
                  <strong>{user?.name ?? "Someone"}</strong> {entry.message}
                </p>
                <p className="activity-time">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
          );
        })}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Team">
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