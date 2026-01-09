"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import CustomButton from "@/components/CustomButton/CustomButton";
import styles from "./SearchResultsClient.module.css";
import PostItem from "@/components/PostItem/PostItem";
import { PostItemProps, UserProps } from "@/types/postTypes";
import Image from "next/image";
import Link from "next/link";
import { formatDateToReadable } from "@/_lib/format_date";

interface PostsData {
  posts: PostItemProps[];
  users?: never;
}

interface UsersData {
  users: UserProps[];
  posts?: never;
}

type InitialData = PostsData | UsersData | null;

interface Props {
  initialData: InitialData;
  type: "users" | "posts";
}

export default function SearchResultsClient({ initialData, type }: Props) {
  console.log("initial", initialData)
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedType = searchParams.get("type") || type;

  const handleTypeChange = (newType: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", newType.toLowerCase());
      router.replace(`/search?${params.toString()}`);
    });
  };

  return (
    <div>
      {/* Type Buttons */}
      <div className={styles.typeButtonsContainer}>
        <CustomButton
          className={`${ButtonStyles.primary_button} ${styles.typeButton} ${
            selectedType === "users" ? styles.active : ""
          }`}
          title="Users"
          onClick={() => handleTypeChange("users")}
        />
        <CustomButton
          className={`${ButtonStyles.primary_button} ${styles.typeButton} ${
            selectedType === "posts" ? styles.active : ""
          }`}
          title="Posts"
          onClick={() => handleTypeChange("posts")}
        />
      </div>

      {/* Results */}
      <div className={styles.searchResultsContainer}>
        {selectedType === "posts" &&
          (initialData && "posts" in initialData && initialData?.posts?.length ? (
            initialData?.posts.map((post: PostItemProps) => (
              <PostItem
                commentCount={post.commentCount}
                key={post.id}
                vote={0}
                noStats
                id={post.id}
                title={post.title}
                description={post.description}
                username={post.username}
                created_at={post.created_at}
                userVote={post.userVote}
                images={post.images}
              />
            ))
          ) : (
            <p className={styles.noResults}>No results</p>
          ))}

        {selectedType === "users" &&
          (initialData && "users" in initialData && initialData?.users?.length ? (
            initialData?.users.map((user: UserProps, index: number) => (
              <div key={user.id}>
                {index !== 0 && <hr className="line" />}
                <Link href={`/users/${user.id}`} className={styles.userprofileContainer}>
                  <Image
                    src={`https://api.dicebear.com/9.x/adventurer/png?seed=${user.username}`}
                    width={50}
                    height={50}
                    alt={`${user.username} avatar`}
                  />
                  <div className={styles.usernameContainer}>
                    <h1 className={styles.username}>{user.username}</h1>
                    <p className={styles.memberSince}>
                      Member since {formatDateToReadable(user.created_at)}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No results</p>
          ))}
      </div>

      {isPending && <p>Loading...</p>}
    </div>
  );
}
