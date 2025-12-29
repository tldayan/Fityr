"use client";
import React from "react";
import styles from "./Hamburger.module.css";
import { useSidebar } from "@/context/SidebarContext";

export default function Hamburger() {
  const { isOpen, setIsOpen } = useSidebar();

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
