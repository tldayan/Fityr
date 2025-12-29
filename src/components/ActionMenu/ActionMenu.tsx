import React, { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./ActionMenu.module.css";

interface ActionMenuOption {
  label: string;
  onClick: () => void;
}

interface ActionMenuProps {
  children: ReactNode;
  options: ActionMenuOption[];
  align?: "left" | "right";
}

const ActionMenu: React.FC<ActionMenuProps> = ({ children, options, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.actionMenu} ref={menuRef}>
      <div onClick={toggleMenu} className={styles.trigger}>
        {children}
      </div>

      {isOpen && (
        <ul
          className={`${styles.menuList} ${
            align === "right" ? styles.alignRight : styles.alignLeft
          }`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.menuItem}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActionMenu;
