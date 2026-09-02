import { historyIco, bellIco, layoutIco, layoutRightIco } from "../icons";

function TopBar({ projectName, onToggleRightPanel, onToggleSidebar }) {
  return (
    <div className="top-bar">
      <nav className="top-bar-breadcrumb">
        <button type="button" className="top-bar-icon-button" onClick={onToggleSidebar}><span className="icon-layout-wrap">{layoutIco}</span></button>
        <span className="top-bar-text">Workspace</span>
        <span className="crumb-sep">/</span>
        <span className="top-bar-text">Company, Inc</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{projectName}</span>
      </nav>
      <div className="top-bar-search">
        <input type="text" placeholder="Search" readOnly />
        <span className="top-bar-search-shortcut">/</span>
      </div>
      <div className="top-bar-actions">
        <button type="button" className="top-bar-icon-button">{historyIco}</button>
        <button type="button" className="top-bar-icon-button"><span className="icon-bell-wrap">{bellIco}</span></button>
        <button type="button" className="top-bar-icon-button" onClick={onToggleRightPanel}><span className="icon-layout-wrap">{layoutRightIco}</span></button>
      </div>
      
    </div>
  );
}

export default TopBar;