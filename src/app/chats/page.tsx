import React from 'react'
import styles from "./page.module.css"
import ChatList from './_components/ChatList/ChatList'
import ChatContainer from './_components/ChatContainer/ChatContainer'

export default function page() {

  

  return (
    <div>
      <h1>CHATS</h1>
      <div className={styles.mainContainer}>
        <ChatList />
        <ChatContainer />
      </div>
    </div>
  )
}
