import React from 'react'
import styles from "./ReplyItem.module.css"

interface ReplyItemProps {
  reply: CommentResponse
}

export default function ReplyItem({reply}: ReplyItemProps) {
  return (
    <div className={styles.replyContainer}>
      <p>{reply.username}</p>
      <p>{reply.comment}</p>
    </div>
  )
}
