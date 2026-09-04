import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chevronIco, checkmarkIco } from "../icons";

function CustomSelect({ value, onChange, options, placeholder = "", disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const wrapperRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const recalcPosition = () => {
        if (!wrapperRef.current || !dropdownRef.current) return;
        const triggerRect = wrapperRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        setDropUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    };

    useLayoutEffect(() => {
        if (!isOpen) return;
        recalcPosition();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener("resize", recalcPosition);
        window.addEventListener("scroll", recalcPosition, true);
        return () => {
            window.removeEventListener("resize", recalcPosition);
            window.removeEventListener("scroll", recalcPosition, true);
        };
    }, [isOpen]);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen((open) => !open);
    };

    return (
        <div className="custom-select" ref={wrapperRef}>
            <button
                type="button"
                className={`custom-select-trigger ${disabled ? "disabled" : ""} ${isOpen ? "open" : ""}`}
                onClick={handleToggle}
            >
                <span className={`custom-select-value ${selectedOption ? "" : "custom-select-placeholder"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="chevron">{chevronIco}</span>
            </button>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`custom-select-dropdown ${dropUp ? "custom-select-dropdown--up" : ""}`}
                >
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={`custom-select-option ${option.value === value ? "active" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span className="custom-select-option-label">{option.label}</span>
                            {option.value === value && <span className="custom-select-check">{checkmarkIco}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;