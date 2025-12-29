"use client"
import React, { useState } from 'react'
import styles from "./ChipSelector.module.css"

interface ChipSelectorProps {
  options: string[]; 
  onChange: (selected: string) => void; 
  selected: string
}

export default function ChipSelector({options, onChange, selected} : ChipSelectorProps) {

  return (
    <div className={styles.container}>
      {options.map((eachOption, index) => {
       return <button className={`${styles.chipButton} ${selected === eachOption ? styles.selected : ""}`} onClick={() =>onChange(eachOption)} key={index}>{eachOption}</button>
      })}
    </div>
  )
}
