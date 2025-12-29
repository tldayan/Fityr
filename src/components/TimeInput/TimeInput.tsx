"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./TimeInput.module.css";

interface TimeInputProps {
  label: string;
  value: string | null;            
  onChange: (dateString: string | null) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
  
  const formatDate = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };

  return (
    <div style={{ margin: "10px 0" }}>
        <label className={styles.label}>{label}</label>

        <DatePicker
    className={styles.datePickerInput}
    selected={value ? new Date(value) : null}
    onChange={(date) => {
      if (!date) return onChange(null);
      onChange(formatDate(date));
    }}
    fixedHeight
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    timeCaption="time"
    dateFormat="MMMM d, yyyy h:mm aa"
    placeholderText="Select date & time"


    minDate={new Date()}
    minTime={
      value && new Date(value).toDateString() === new Date().toDateString()
        ? new Date()
        : new Date(new Date().setHours(0, 0, 0, 0))
    }
    maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
  />


    </div>
  );
};

export default TimeInput;
