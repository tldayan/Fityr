"use client"
import React from 'react'
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useSidebar } from '@/context/SidebarContext';
import { myFont } from '@/app/layout';

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <ul className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/">Feed</Link>
      </li>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/events">Events</Link>
      </li>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/chats">Chats</Link>
      </li>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/groups">Groups</Link>
      </li>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/profile">Profile</Link>
      </li>
    </ul>
  );
}
