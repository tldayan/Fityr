import React from "react";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "small";
  className?: string;
  noMargin?: boolean; 
  themed?: boolean
}

export default function LoadingSpinner({ size, className, noMargin,themed }: LoadingSpinnerProps) {
  return (
    <div
      className={`
        ${styles.load_animation_black}
        ${themed ? styles.themed : {}}
        ${size === "small" ? styles.small : ""}
        ${noMargin ? styles.no_margin : ""}
        ${className || ""}
      `}
    ></div>
  );
}
