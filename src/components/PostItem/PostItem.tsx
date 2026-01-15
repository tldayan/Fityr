"use client";
import React, { useEffect, useState } from "react";
import ComponentContainer from "../ComponentContainer/ComponentContainer";
import styles from "./PostItem.module.css";
import { useRouter, usePathname } from "next/navigation";
import UpVote from "@/app/assets/icons/upVote.svg";
import DownVote from "@/app/assets/icons/downVote.svg";
import Forward from "@/app/assets/icons/forward.svg";
import Comment from "@/app/assets/icons/message-square.svg";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import useDebounce from "@/hooks/useDebounce";
import { apiClient } from "@/utils/apiClient";
import { PostItemProps } from "@/types/postTypes";
import { formatTimeAgo } from "@/_lib/format_date";
import { queryClient } from "@/utils/reactQueryClient";
import toast from "react-hot-toast";
import { useStytchUser } from "@stytch/nextjs";
import ImageCarousel from "../ImageCarousel/ImageCarousell";

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
  images
}: PostItemProps) {
  const [mounted, setMounted] = useState(false);
  const [voteCount, setVoteCount] = useState(vote);
  const [currentUserVote, setCurrentUserVote] = useState<"upvote" | "downvote" | null>(userVote);

  const debouncedVote = useDebounce(voteCount, 2000);
  const router = useRouter();
  const pathname = usePathname();
  const postUrl = `${ENDPOINTS.POSTS}/${id}`;
  const isOnPostPage = pathname === postUrl;
  const { user } = useStytchUser();

  useEffect(() => {
    setMounted(true);
    setVoteCount(vote);
    setCurrentUserVote(userVote);
  }, [vote, userVote]);


  const handleUpVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to upvote posts!");

    if (!mounted) return;

    if (currentUserVote === "downvote") {
      setVoteCount(v => v + 2);
      setCurrentUserVote("upvote");
      return;
    }
    if (currentUserVote === "upvote") {
      setVoteCount(v => v - 1);
      setCurrentUserVote(null);
      return;
    }
    setVoteCount(v => v + 1);
    setCurrentUserVote("upvote");
  };

  const handleDownVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to downvote posts!");

    if (!mounted) return;

    if (currentUserVote === "upvote") {
      setVoteCount(v => v - 2);
      setCurrentUserVote("downvote");
      return;
    }
    if (currentUserVote === "downvote") {
      setVoteCount(v => v + 1);
      setCurrentUserVote(null);
      return;
    }
    setVoteCount(v => v - 1);
    setCurrentUserVote("downvote");
  };


  useEffect(() => {
    if (!mounted) return;
    if (debouncedVote !== vote && currentUserVote) {
      apiClient(`${BASE_URL}${postUrl}/vote`, "PATCH", { voteType: currentUserVote })
        .then(() => queryClient.invalidateQueries({ queryKey: ["posts"] }));
    }
  }, [debouncedVote, mounted]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}/posts/${id}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOnPostPage) router.push(postUrl);
  };

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/users/${username}`);
  };

  const handleNavigateToPost = () => {
    if (!isOnPostPage) router.push(postUrl);
  };

  return (
    <ComponentContainer>
      <div className={styles.link} onClick={handleNavigateToPost}>
        <div className={styles.postContent}>
          <h4 className={styles.title}>{title}</h4>

          <p className={styles.first_name}>
            <span className={styles.by}>by</span>{" "}
            <span className={styles.name} onClick={handleUsernameClick} style={{ cursor: "pointer" }}>
              {username}
            </span>
            <span> • {formatTimeAgo(created_at)}</span>
          </p>

          <p className={`${styles.description} ${!isOnPostPage ? styles.minimized : ""}`}>
            {description.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>


          <div onClick={(e) => e.stopPropagation()}>
            <ImageCarousel images={images || []} width={"100%"} loop={true} />
          </div>

          {mounted && !noStats && (
            <div className={styles.mainPostsStatsContainer}>
              <div className={styles.postsStatsContainer}>
                <UpVote
                  onClick={handleUpVote}
                  width={24} height={24} stroke="green"
                  className={`${styles.voteButtons} ${currentUserVote === "upvote" ? styles.upvoted : ""}`}
                />
                <p className={styles.voteCount}>{voteCount}</p>
                <DownVote
                  onClick={handleDownVote}
                  width={24} height={24} stroke="red"
                  className={`${styles.voteButtons} ${currentUserVote === "downvote" ? styles.downvoted : ""}`}
                />
              </div>

              <div onClick={handleShare} className={styles.shareButtonContainer}>
                <Forward color="black" width={17} height={17} />
              </div>

              <div className={styles.commentButtonContainer} onClick={handleCommentClick}>
                <Comment color="black" width={17} height={17} />
                <p className={styles.commentCount}>{commentCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ComponentContainer>
  );
}
