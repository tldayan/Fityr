import React from 'react'
import styles from "./CustomTextInput.module.css"
import globalStyles from "@/globalStyles/InputStyles.module.css"

type CustomInputProps = {
  label?: string;
  value?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  noMarginTop?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  loading?: boolean;
};


export default function CustomTextInput({
  label,
  value,
  onChange,
  name,
  type,
  disabled,
  placeholder,
  noMarginTop,
  onKeyDown,
  loading = false,
}: CustomInputProps) {
  return (
    <div className={`${styles.textInputContainer} ${noMarginTop ? styles.noMargin : ""}`}>
      {label && <label className={globalStyles.inputLabel}>{label}</label>}

      {loading ? (
        <div className={styles.skeleton} />
      ) : (
        <input
          name={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          value={value}
          className={`${styles.textInput} ${disabled ? styles.disabled : ""}`}
          id={name}
          type={type}
          disabled={disabled}
        />
      )}
    </div>
  );
}

