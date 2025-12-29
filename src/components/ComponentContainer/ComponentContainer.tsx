import React from 'react'
import styles from "./ComponentContainer.module.css"

interface ComponentContainerProps {
  background?: boolean;
  children: React.ReactNode;
}

export default function ComponentContainer({ children, background }: ComponentContainerProps) {
  return (
    <div className={`${styles.componentContainer} ${background ? styles.hover : ""}`}>
      {children}
    </div>
  );
}
