"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Hambuger from "../Hamburger/Hambuger";
import { useTheme } from "@/context/ThemeContext";
import AuthModal from "../AuthModal/AuthModal";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import Avatar from "../Avatar/Avatar";
import ActionMenu from "../ActionMenu/ActionMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState("");

  const stytchClient = useStytch();
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await stytchClient.session.revoke();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleViewProfile = () => {
    if (!user?.name?.first_name) return;
    router.push(`/users/${user.name.first_name}`);
  };

  console.log("from header", user)
  return (
    <header className={styles.header}>
      <Hambuger />

      <Link href={"/"} className={styles.logo}>FITYR</Link>

      <div className={styles.authContainer}>
      {!isInitialized ? (
        <p>Loading</p>
      ) : !user ? (
    <>
      <button
        className={styles.authButtons}
        onClick={() => setAuthMode("Log In")}
      >
        Log In
      </button>
      <button
        className={styles.authButtons}
        onClick={() => setAuthMode("Sign Up")}
      >
        Sign Up
      </button>
    </>
  ) : (
    <>
      <p className={styles.username}>
        {user.name.first_name}
      </p>

      <ActionMenu
        options={[
          { label: "View Profile", onClick: handleViewProfile },
          { label: "Logout", onClick: handleLogout },
        ]}
        align="right"
      >
        <Avatar
          nonRoutable
          className={styles.profilePic}
          user={{
            username: user.name.first_name,
            profilePic:
              (user.trusted_metadata?.profilePic as string) ?? undefined,
          }}
        />
      </ActionMenu>
    </>
  )}
</div>

      {/* <Image
        onClick={toggleTheme}
        alt="Car"
        width={24}
        height={24}
        src={theme === "light" ? images.headlightOn : images.headlightOn}
      /> */}

   

      {(authMode === "Sign Up" || authMode === "Log In") && (
        <AuthModal authMode={authMode} setAuthMode={setAuthMode} />
      )}

    </header>
  );
}
