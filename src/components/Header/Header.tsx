"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Hambuger from "../Hamburger/Hambuger";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import AuthModal from "../AuthModal/AuthModal";
import { images } from "@/utils/assets";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import { useApiClient } from "@/hooks/useApiClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Avatar from "../Avatar/Avatar";
import ActionMenu from "../ActionMenu/ActionMenu";
import { useRouter } from "next/navigation";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState("");

  const stytchClient = useStytch();
  const { user, isInitialized } = useStytchUser();
  const apiClient = useApiClient();
  const stytchUser = useStytchUser()
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await stytchClient.session.revoke();
      await apiClient(`${BASE_URL}${ENDPOINTS.LOGOUT}`, "POST");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleViewProfile = () => {
    if (!user?.name?.first_name) return;
    router.push(`/users/${user.name.first_name}`);
  };

  return (
    <header className={styles.header}>
      <Hambuger />

      <h1 className={styles.logo}>Fityr</h1>

      <div className={styles.authContainer}>
      {!user ? (
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
          <p>
            {user?.name.first_name}
          </p>
        </>
      )}
      <ActionMenu
                options={[
                  { label: "View Profile", onClick: handleViewProfile },
                  { label: "Logout", onClick: handleLogout },
                ]}
                align="right"
              >
      {user && <Avatar nonRoutable className={styles.profilePic} user={{username: user?.name?.first_name ?? "profile", profilePic: (user?.trusted_metadata?.profilePic as string) ?? undefined}} />}
    </ActionMenu>
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
