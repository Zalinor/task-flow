import { useEffect, useRef, useState } from "react";

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

function DateTimePicker({value, onClose, onApply, position}) {
    const initial = parseValue(value);
    const [selectedDate, setSelectedDate] = useState(initial.date);
    const [hour, setHour] = useState(initial.hour);
    const [minute, setMinute] = useState(initial.minute);
    const [ampm, setAmpm] = useState(initial.ampm);
    const [viewYear, setViewYear] = useState(initial.viewYear);
    const [viewMonth, setViewMonth] = useState(initial.viewMonth);
    const popoverRef = useRef(null);

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

    return (
        <div
            className="datetime-picker"
            ref={popoverRef}
            style={{
                top: position.top,
                left: position.left,
                transform: position.openUpward ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            }}
        >
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
                <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="--"
                    value={hour ?? ""}
                    onChange={(event) => {
                        const val = event.target.value;
                        if (val === "") { setHour(null); return; }
                        const num = Math.max(1, Math.min(12, Number(val)));
                        setHour(num);
                    }}
                />
                <span>:</span>
                <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="--"
                    value={minute === null ? "" : pad(minute)}
                    onChange={(event) => {
                        const val = event.target.value;
                        if (val === "") { setMinute(null); return; }
                        const num = Math.max(0, Math.min(59, Number(val)));
                        setMinute(num);
                    }}
                />
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