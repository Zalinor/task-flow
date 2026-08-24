import UserSwitcher from "./UserSwitcher";
import { historyIco, bellIco, layoutIco } from "../icons";

function TopBar({ projectName, activeUserId, onSelectUser, onToggleRightPanel }) {
  return (
    <header className="top-bar">
      <div className="top-bar-logo">
        <span className="top-bar-logo-mark">✳</span> bureau<span className="top-bar-logo-accent">pro+</span>
      </div>
      <nav className="top-bar-breadcrumb">
        <span>Workspace</span>
        <span className="crumb-sep">/</span>
        <span>Company, Inc</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{projectName}</span>
      </nav>
      <div className="top-bar-search">
        <input type="text" placeholder="Search" readOnly />
        <span className="top-bar-search-shortcut">/</span>
      </div>
      <div className="top-bar-actions">
        <button type="button" className="top-bar-icon-button">{historyIco}</button>
        <button type="button" className="top-bar-icon-button">{bellIco}</button>
        <button type="button" className="top-bar-icon-button" onClick={onToggleRightPanel}>{layoutIco}</button>
      </div>
      <UserSwitcher activeUserId={activeUserId} onSelectUser={onSelectUser} compact />
    </header>
  );
}

export default TopBar;