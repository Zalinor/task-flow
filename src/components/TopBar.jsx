import { useEffect, useRef } from "react";
import { historyIco, bellIco, layoutIco, layoutRightIco, searchIcon } from "../icons";

function TopBar({ projectName, activeUserId, onSelectUser, onToggleRightPanel, onToggleSidebar, searchQuery, onSearchChange }) {
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== "/") return;
            const target = event.target;
            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
            if (isTyping) return;
            event.preventDefault();
            searchInputRef.current?.focus();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
    
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
        <span className="top-bar-search-icon">{searchIcon}</span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <button
          type="button"
          className="top-bar-search-shortcut"
          onClick={() => searchInputRef.current?.focus()}
        >
          /
        </button>
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