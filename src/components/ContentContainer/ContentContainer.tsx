import React from 'react'
import styles from "./ContentContainer.module.css";

export default function ContentContainer({children}: React.PropsWithChildren) {
  return (
    <div className={styles.contentContainer}>{children}</div>
  )
}
