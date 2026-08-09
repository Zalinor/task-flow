import { useEffect, useRef } from "react";

const STATUS_OPTIONS = [
    {value: "All", label: "All"},
    {value: "Open", label: "Open"},
    {value: "In Review", label: "In Review"},
    {value: "Frozen", label: "Frozen"},
    {value: "Done", label: "Done"},
];

const PRIORITY_OPTIONS = [
    {value: "All", label: "All"},
    {value: "High", label: "High"},
    {value: "Medium", label: "Medium"},
    {value: "Low", label: "Low"},
];

function FilterPanel({
    statusFilter, onStatusChange,
    priorityFilter, onPriorityChange,
    dueDateSort, onDueDateSortChange,
    onClose,
}) {
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="filter-panel" ref={panelRef}>
            <div className="filter-group">
                <h4>Status</h4>
                {STATUS_OPTIONS.map((option) => (
                    <label key={option.value} className="filter-option">
                        <input
                         type="radio" 
                         name="status-filter"
                         checked={statusFilter === option.value}
                         onChange={() => onStatusChange(option.value)}
                         />
                         {option.label}
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>priority</h4>
                {PRIORITY_OPTIONS.map((option) => (
                    <label key={option.value} className="filter-option">
                        <input 
                         type="radio" 
                         name="priority-filter"
                         checked={priorityFilter === option.value}
                         onChange={() => onPriorityChange(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>Due Date</h4>
                    <label className="filter-option">
                        <input 
                         type="radio" 
                         name="due-date-sort"
                         checked={dueDateSort === null}
                         onChange={() => onDueDateSortChange(null)}
                        />
                        Default order
                    </label>
                    <label className="filter-option">
                        <input 
                         type="radio" 
                         name="due-date-sort"
                         checked={dueDateSort === "asc"}
                         onChange={() => onDueDateSortChange("asc")}
                        />
                        Soonest first
                    </label>
                    <label className="filter-option">
                        <input 
                         type="radio" 
                         name="due-date-sort"
                         checked={dueDateSort === "desc"}
                         onChange={() => onDueDateSortChange("desc")}
                        />
                        Latest first
                    </label>
            </div>
        </div>
    );
}

export default FilterPanel;