import React from 'react'
import styles from "./BackgroundOverlay.module.css"

export default function BackgroundOverlay({children} : React.PropsWithChildren) {
  return (
    <div className={styles.overlay}>{children}</div>
  )
}
