"use client"
import React, { useEffect } from 'react'
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useSidebar } from '@/context/SidebarContext';
import { myFont } from '@/app/layout';
import { usePathname } from "next/navigation";


export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathName = usePathname()

  useEffect(() => {
    if (!isOpen) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    setIsOpen(false);
  }, [pathName]);



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
{/*       <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/groups">Groups</Link>
      </li> */}
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/users/profile">Profile</Link>
      </li>
    </ul>
  );
}
