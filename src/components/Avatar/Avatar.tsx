import UserIcon from "@/app/assets/icons/user.svg";
import Image from "next/image";
import styles from "./Avatar.module.css"
import Link from "next/link";

interface User {
  username: string;
  profilePic?: string;
}

interface AvatarProps {
  user: User;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  nonRoutable?: boolean;
}

export default function Avatar({
  user,
  size = 30,
  className = "",
  style,
  nonRoutable = false,
}: AvatarProps) {
  const avatar = !user.profilePic ? (
    <UserIcon
      strokeWidth={1.8}
      width={size}
      height={size}
      color="gray"
      className={`${className} ${styles.profileIconBorder}`}
      style={style}
    />
  ) : (
    <Image
      src={user.profilePic}
      height={size}
      width={size}
      unoptimized
      alt={`${user.username}'s avatar`}
      className={`${className} ${styles.profileBorder}`}
      style={{ borderRadius: "50%", ...style }}
    />
  );

  if (nonRoutable) {
    return avatar; 
  }

  return (
    <Link href={`/${user.username}`}>
      {avatar}
    </Link>
  );
}
