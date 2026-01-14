"use client";
import React, { useEffect } from "react";
import styles from "./Hamburger.module.css";
import { useSidebar } from "@/context/SidebarContext";

export default function Hamburger() {
  const { isOpen, setIsOpen } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`${styles.hamburger} ${styles["is-sm"]} ${
        isOpen ? styles["is-active"] : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
    >
      <span className={styles["hamburger-line"]}></span>
      <span className={styles["hamburger-line"]}></span>
      <span className={styles["hamburger-line"]}></span>
    </div>
  );
}
