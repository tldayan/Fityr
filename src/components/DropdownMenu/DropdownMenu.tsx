import React, { useState, useRef, useEffect } from "react";
import styles from "./DropdownMenu.module.css";
import globalStyles from "@/globalStyles/InputStyles.module.css"

interface DropdownMenuProps {
  label?: string;
  options: string[];
  value?: string | number;
  onSelect?: (value: string) => void;
  className?: string;
  placeholder?: string;
  viewMode?: boolean
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label = "Select",
  options,
  value,
  placeholder,
  viewMode,
  onSelect,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selectedValue: string) => {
    onSelect?.(selectedValue);
    closeDropdown();
  };

  const openDropdown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
    setClosing(false);

    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const listHeight = options.length * 36;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < listHeight && spaceAbove > listHeight);
    }
  };

  const closeDropdown = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
<div className={`${styles.dropdown} ${className ?? ""}`} ref={dropdownRef}>
      {label && <label className={globalStyles.inputLabel}>{label}</label>}
      <button
        disabled={!viewMode}
        type="button"
        className={`${styles.dropdownButton} ${!viewMode ? styles.disabled : ""}`}
        onClick={(e) => (isOpen ? closeDropdown() : openDropdown(e))}
      >
        <span className={styles.placeholder}>{value || placeholder}</span>
        <svg
          className={`${styles.arrowIcon} ${isOpen ? styles.rotate : ""}`}
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {(isOpen || closing) && (
        <ul
          className={`${styles.dropdownList} ${
            openUp ? styles.openUp : styles.openDown
          } ${closing ? styles.fadeOut : styles.fadeIn}`}
        >
          {options.map((option) => (
            <li
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
