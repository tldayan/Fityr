"use client"
import React, { useState } from 'react'
import styles from "./ChatConainer.module.css"
import CustomTextInput from '@/components/CustomTextInput/CustomTextInput'
import SendIcon from "@/assets/icons/send.svg"
import CustomIconButton from '@/components/CustomIconButton/CustomIconButton'

export default function ChatContainer() {

  const [message, setMessage] = useState("")

  return (
    <div className={styles.chatContainer}>
{/*       <h3>Chat container</h3> */}
      <div className={styles.chatInputContainer}>
        <CustomTextInput placeholder='Enter message' onChange={(e) => setMessage(e.target.value)} value={message} noMarginTop />
        <SendIcon width={30} height={30} strokeWidth={1.5} color='gray' style={{ cursor: "pointer" }} />
      </div>

    </div>
  )
}
