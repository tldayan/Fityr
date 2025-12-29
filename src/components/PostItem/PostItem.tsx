"use client";
import React, { useEffect, useState } from "react";
import ComponentContainer from "../ComponentContainer/ComponentContainer";
import styles from "./PostItem.module.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UpVote from "@/app/assets/icons/upVote.svg";
import DownVote from "@/app/assets/icons/downVote.svg";
import Forward from "@/app/assets/icons/forward.svg";
import Comment from "@/app/assets/icons/comment.svg";
import { BASE_URL, ENDPOINTS } from '@/_lib/apiEndpoints';
import useDebounce from "@/hooks/useDebounce";
import { apiClient } from "@/utils/apiClient";
import { PostItemProps } from "@/types/postTypes";
import { formatTimeAgo } from "@/_lib/format_date";
import { queryClient } from "@/utils/reactQueryClient";



export default function PostItem({
  title,
  id,
  created_at,
  vote,
  username,
  noStats,
  commentCount,
  description,
  userVote,
  showDivider

}: PostItemProps) {
  const [voteCount, setVoteCount] = useState(vote);
  const [currentUserVote, setCurrentUserVote] = useState<"upvote" | "downvote" | null>(userVote);
  const debouncedVote = useDebounce(voteCount, 3000);

  const router = useRouter();
  const pathname = usePathname();
  const postUrl = `${ENDPOINTS.POSTS}/${id}`;
  const isOnPostPage = pathname === postUrl;

useEffect(() => {
  setVoteCount(vote);
  setCurrentUserVote(userVote);
}, [vote, userVote])

  const handleUpVote = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (currentUserVote === "downvote") {
      setVoteCount((prev) => prev + 2);
      setCurrentUserVote("upvote");
      return;
    }

    if (currentUserVote === "upvote") {
      setVoteCount((prev) => prev - 1);
      setCurrentUserVote(null);
      return;
    }

    setVoteCount((prev) => prev + 1);
    setCurrentUserVote("upvote");
  };

  const handleDownVote = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (currentUserVote === "upvote") {
      setVoteCount((prev) => prev - 2);
      setCurrentUserVote("downvote");
      return;
    }

    if (currentUserVote === "downvote") {
      setVoteCount((prev) => prev + 1);
      setCurrentUserVote(null);
      return;
    }

    setVoteCount((prev) => prev - 1);
    setCurrentUserVote("downvote");
  };

  useEffect(() => {
  if (debouncedVote !== vote && currentUserVote) {
    apiClient(`${BASE_URL}${postUrl}/vote`, "PATCH", {
      voteType: currentUserVote,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    });
  }
}, [debouncedVote]);


  const handleShare = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    alert("Share post");
  };

  const handleCommentClick = (event: React.MouseEvent) => {
    if(isOnPostPage) return
    event.preventDefault();
    event.stopPropagation();
    router.push(postUrl);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/users/${username}`);
  };

  const PostContent = (
    <>
    <div className={styles.postContent}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.first_name}>
        <span className={styles.by}>by</span>{" "}
        <span
          className={styles.name}
          onClick={handleUsernameClick}
          style={{ cursor: "pointer" }}
        >
          {username}
        </span>
        <span> • {formatTimeAgo(created_at)}</span>
      </p>

      <p
        className={`${styles.description} ${
          !isOnPostPage ? styles.minimized : ""
        }`}
      >
        {description}
      </p>

      {!noStats && <div className={styles.mainPostsStatsContainer}>
        <div className={styles.postsStatsContainer}>
          <UpVote
            onClick={handleUpVote}
            width={24}
            height={24}
            stroke="green"
            className={`${styles.voteButtons} ${
              currentUserVote === "upvote" ? styles.upvoted : ""
            }`}
          />
          <p className={styles.voteCount}>{voteCount}</p>
          <DownVote
            onClick={handleDownVote}
            width={24}
            height={24}
            stroke="red"
            className={`${styles.voteButtons} ${
              currentUserVote === "downvote" ? styles.downvoted : ""
            }`}
          />
        </div>

        <div className={styles.shareButtonContainer}>
          <Forward
            onClick={handleShare}
            className={styles.share}
            width={18}
            height={18}
          />
        </div>

        <div
          className={styles.commentButtonContainer}
          onClick={handleCommentClick}
        >
          <Comment className={styles.share} width={15} height={15} />
          <p className={styles.commentCount}>{commentCount}</p>
        </div>
      </div>}
    </div>
    </>
  );

  return (
    <ComponentContainer>
      {isOnPostPage ? (

        <div className={`${styles.link} ${styles.disabledLink}`}>
          {PostContent}
        </div>
      ) : (
        
        <Link href={postUrl} className={styles.link}>
          {PostContent}
        </Link>
      )}
    </ComponentContainer>
  );
}
