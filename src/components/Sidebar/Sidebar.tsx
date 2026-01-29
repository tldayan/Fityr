"use client";

import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useSidebar } from "@/context/SidebarContext";
import { myFont } from "@/app/layout";
import { useRouter } from "next/navigation";
import { useStytchUser } from "@stytch/nextjs";
import toast from "react-hot-toast";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const router = useRouter();
  const { user } = useStytchUser();

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault(); 
      toast.error("You must be logged in first!");
      return;
    }
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <ul className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/" onClick={handleLinkClick}>
          Feed
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/events" onClick={handleLinkClick}>
          Events
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/chats" onClick={handleLinkClick}>
          Chats
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link
          className={styles.links}
          href={user ? `/users/${user.name.first_name}` : "#"}
          onClick={handleProfileClick}
        >
          Profile
        </Link>
      </li>
    </ul>
  );
}
