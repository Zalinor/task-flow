import { useEffect, useRef, useState } from "react";
import { chevronIco } from "../icons";

function CustomSelect({ value, onChange, options, placeholder = "", disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

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
            <button type="button" className={`custom-select-trigger ${disabled ? "disabled" : ""}`} onClick={handleToggle}>
                <span className={selectedOption ? "" : "custom-select-placeholder"}>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={`chevron ${isOpen ? "" : "closed"}`}>{chevronIco}</span>
            </button>
            {isOpen && (
                <div className="custom-select-dropdown">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={`custom-select-option ${option.value === value ? "active" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;