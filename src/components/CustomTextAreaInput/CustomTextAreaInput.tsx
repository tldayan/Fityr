import React from 'react'
import styles from "./CustomTextAreaInput.module.css"
import globalStyles from "../../globalStyles/InputStyles.module.css"

type CustomAreaInputProps = {
  label?: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean; 
};


export default function CustomAreaTextInput({
  label,
  disabled,
  value,
  onChange,
  name,
  placeholder,
  loading = false,
}: CustomAreaInputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.textAreaLabel}>{label}</label>}

      {loading ? (
        <div className={styles.textAreaSkeleton} />
      ) : (
        <textarea
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`${styles.textArea} ${disabled ? styles.disabled : ""}`}
          name={name}
        />
      )}
    </div>
  );
}
