"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import CustomButton from "@/components/CustomButton/CustomButton";
import PostItem from "@/components/PostItem/PostItem";
import styles from "./SearchResultsClient.module.css";
import { PostItemProps, UserProps } from "@/types/postTypes";
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
    <div className={styles.mainSearchResultsContainer}>

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


      <div className={styles.searchResultsContainer}>
        {selectedType === "posts" &&
          initialData &&
          "posts" in initialData &&
          initialData.posts &&
          initialData.posts.length ? (
            initialData.posts.map((post: PostItemProps) => (
              <PostItem
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                username={post.username}
                created_at={post.created_at}
                vote={0}
                userVote={post.userVote}
                commentCount={post.commentCount}
                images={post.images}
                noStats
              />
            ))
          ) : selectedType === "posts" ? (
            <p className={styles.noResults}>No results</p>
          ) : null}


       {selectedType === "users" &&
  initialData &&
  "users" in initialData &&
  initialData.users &&
  initialData.users.length ? (
    initialData.users.map((user: UserProps, index: number) => (
      <div key={user.id}>
        {index !== 0 && <hr className="line" />}
        <Link
          href={`/users/${user.id}`}
          className={styles.userprofileContainer}
        >
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
  ) : selectedType === "users" ? (
    <p className={styles.noResults}>No results</p>
  ) : null}

      </div>

      {isPending && <p>Loading...</p>}
    </div>
  );
}
