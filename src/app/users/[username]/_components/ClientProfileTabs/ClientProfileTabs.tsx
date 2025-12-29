
"use client";

import { useRouter } from "next/navigation";
import ChipSelector from "@/components/ChipSelector/ChipSelector";
import UserProfileContent from "../UserProfileContent/UserProfileContent";
import { UserProfileResponse } from "@/types/user";
import Avatar from "@/components/Avatar/Avatar";
import { formatDateToReadable } from "@/_lib/format_date";
import styles from "./ClientProfileTabs.module.css"

interface ClientProfileTabsProps {
  username: string;
  user: UserProfileResponse
  selected: "Events" | "Posts" | "Comments";
}

export default function ClientProfileTabs({
  username,
  user,
  selected,
}: ClientProfileTabsProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    router.push(`?content=${value.toLowerCase()}`);
  };

  return (
    <>
      <div className={styles.userInfoContainer}>
        <Avatar nonRoutable size={80} user={{ username: user.username ?? "unknown", profilePic: user.profilePic ?? undefined}}/>
        <h1>{username}</h1>
        <p>{user.bio}</p>
        <p className={styles.memberSince}>Member since {formatDateToReadable(user.createdAt)}</p>
      </div>
      
    
      <ChipSelector
        selected={selected}
        onChange={handleSortChange}
        options={["Posts", "Comments","Events"]}
      />

      <UserProfileContent
        username={username}
        profileSort={selected}
      /*   user={user} */
      />
    </>
  );
}
