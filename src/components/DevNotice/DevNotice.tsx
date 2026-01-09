import React from 'react';
import styles from './DevNotice.module.css';

export default function DevNotice() {
  return (
    <div className={styles.banner}>
      ⚠️ Fityr is still in development. Some functionality may not work.
    </div>
  );  
}
