import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CustomSelect from "./CustomSelect";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad(n) {
    return String(n).padStart(2, "0");
}

function parseValue(value) {
    const now = new Date();
    if (!value) {
        return { date: null, hour: null, minute: null, ampm: "AM", viewYear: now.getFullYear(), viewMonth: now.getMonth() };
    }
    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    let hour = null, minute = null, ampm = "AM";
    if (timePart) {
        const [h, m] = timePart.split(":").map(Number);
        hour = h % 12 === 0 ? 12 : h % 12;
        minute = m;
        ampm = h >= 12 ? "PM" : "AM";
    }
    return { date: new Date(year, month - 1, day), hour, minute, ampm, viewYear: year, viewMonth: month - 1 };
}

function buildValue(date, hour, minute, ampm) {
    if (!date) return "";
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    if (hour === null || minute === null) {
        return `${y}-${m}-${d}`;
    }
    let h24 = hour % 12;
    if (ampm === "PM") h24 += 12;
    return `${y}-${m}-${d}T${pad(h24)}:${pad(minute)}`;
}

const VIEWPORT_MARGIN = 8;

function DateTimePicker({value, onClose, onApply, anchorRef}) {
    const initial = parseValue(value);
    const [selectedDate, setSelectedDate] = useState(initial.date);
    const [hour, setHour] = useState(initial.hour);
    const [minute, setMinute] = useState(initial.minute);
    const [ampm, setAmpm] = useState(initial.ampm);
    const [viewYear, setViewYear] = useState(initial.viewYear);
    const [viewMonth, setViewMonth] = useState(initial.viewMonth);
    const popoverRef = useRef(null);

    const [position, setPosition] = useState(null);

    const recalcPosition = () => {
        if (!anchorRef?.current || !popoverRef.current) return;
        const anchorRect = anchorRef.current.getBoundingClientRect();
        const popoverHeight = popoverRef.current.offsetHeight;
        const popoverWidth = popoverRef.current.offsetWidth;

        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const spaceAbove = anchorRect.top;

        const openUpward = spaceBelow < popoverHeight + VIEWPORT_MARGIN && spaceAbove > spaceBelow;

        let left = anchorRect.left + anchorRect.width / 2;
        const halfWidth = popoverWidth / 2;
        left = Math.min(Math.max(left, halfWidth + VIEWPORT_MARGIN), window.innerWidth - halfWidth - VIEWPORT_MARGIN);

        setPosition({
            top: openUpward ? anchorRect.top - VIEWPORT_MARGIN : anchorRect.bottom + VIEWPORT_MARGIN,
            left,
            openUpward,
        });
    };

    useLayoutEffect(() => {
        recalcPosition();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", recalcPosition);
        window.addEventListener("scroll", recalcPosition, true);
        return () => {
            window.removeEventListener("resize", recalcPosition);
            window.removeEventListener("scroll", recalcPosition, true);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, outside: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, outside: false });
    }
    let nextDay = 1;
    while (cells.length < 42) {
        cells.push({ day: nextDay, outside: true });
        nextDay += 1;
    }

    const isSelected = (day, outside) => {
        if (!selectedDate || outside) return false;
        return selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;
    };

    const handleSelectDay = (day, outside) => {
        if (outside) return;
        setSelectedDate(new Date(viewYear, viewMonth, day));
    };

    const handleApply = () => {
        onApply(buildValue(selectedDate, hour, minute, ampm));
    };

    useLayoutEffect(() => {
        recalcPosition();
    }, [selectedDate]);

    const style = position
        ? {
              top: position.top,
              left: position.left,
              transform: position.openUpward ? "translate(-50%, -100%)" : "translate(-50%, 0)",
          }
        : { top: 0, left: 0, visibility: "hidden" }; 

    return (
        <div className="datetime-picker" ref={popoverRef} style={style}>
            <div className="datetime-picker-header">
                <button type="button" onClick={handlePrevMonth}>‹</button>
                <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <button type="button" onClick={handleNextMonth}>›</button>
            </div>
            <div className="datetime-picker-weekdays">
                {WEEKDAYS.map((wd) => <span key={wd}>{wd}</span>)}
            </div>
            <div className="datetime-picker-grid">
                {cells.map((cell, index) => (
                    <button
                        type="button"
                        key={index}
                        className={`datetime-picker-day ${cell.outside ? "outside" : ""} ${isSelected(cell.day, cell.outside) ? "selected" : ""}`}
                        onClick={() => handleSelectDay(cell.day, cell.outside)}
                    >
                        {cell.day}
                    </button>
                ))}
            </div>
            <div className="datetime-picker-time">
                <div className="datetime-picker-time-select">
                    <CustomSelect
                        value={hour === null ? "" : String(hour)}
                        placeholder="--"
                        onChange={(val) => setHour(Number(val))}
                        options={Array.from({ length: 12 }, (_, i) => i + 1).map((h) => ({ value: String(h), label: String(h) }))}
                    />
                </div>
                <span>:</span>
                <div className="datetime-picker-time-select">
                    <CustomSelect
                        value={minute === null ? "" : pad(minute)}
                        placeholder="--"
                        onChange={(val) => setMinute(Number(val))}
                        options={Array.from({ length: 60 }, (_, i) => i).map((m) => ({ value: pad(m), label: pad(m) }))}
                    />
                </div>
                <div className="ampm-toggle">
                    <button type="button" className={ampm === "AM" ? "active" : ""} onClick={() => setAmpm("AM")}>AM</button>
                    <button type="button" className={ampm === "PM" ? "active" : ""} onClick={() => setAmpm("PM")}>PM</button>
                </div>
            </div>
            <div className="datetime-picker-actions">
                <button type="button" className="datetime-picker-cancel" onClick={onClose}>Cancel</button>
                <button type="button" className="datetime-picker-apply" onClick={handleApply}>Apply</button>
            </div>
        </div>
    );
}

export default DateTimePicker;