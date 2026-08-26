import { historyIco, bellIco, layoutIco } from "../icons";

function TopBar({ projectName, onToggleRightPanel }) {
  return (
    <div className="top-bar">
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
      
    </div>
  );
}

export default TopBar;