"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useSidebar } from "@/context/SidebarContext";
import { myFont } from "@/app/layout";
import { usePathname, useRouter } from "next/navigation";
import { useStytchUser } from "@stytch/nextjs";
import toast from "react-hot-toast";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathName = usePathname();
  const router = useRouter();
  const { user } = useStytchUser();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (!isOpen) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    setIsOpen(false);
  }, [pathName, isOpen, setIsOpen]);

  const handleProfileClick = () => {
    if (!user) {
      toast.error("You must be logged in first!");
      return;
    }

    router.push(`/users/${user.name.first_name}`);
  };

  return (
    <ul className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/">
          Feed
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/events">
          Events
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <Link className={styles.links} href="/chats">
          Chats
        </Link>
      </li>

      <li className={`${styles.sidebarLink} ${myFont.className}`}>
        <button
          type="button"
          className={`${styles.sidebarLink} ${myFont.className}`}
          onClick={handleProfileClick}
        >
          Profile
        </button>
      </li>
    </ul>
  );
}
