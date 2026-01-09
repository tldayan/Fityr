
'use client'

import { formatTimeAgo } from "@/_lib/format_date";
import React, { useEffect, useState } from "react";
import styles from "./CommentItem.module.css"
import Avatar from "../Avatar/Avatar";
import UpVote from "@/app/assets/icons/upVote.svg";
import DownVote from "@/app/assets/icons/downVote.svg";
import Comment from "@/app/assets/icons/comment.svg";
import CustomAreaTextInput from "../CustomTextAreaInput/CustomTextAreaInput";
import CustomButton from "../CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css"
import { useApiMutation } from "@/hooks/useApiMutation";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

interface CommentItemProps {
  comment: CommentResponse;
  activeReplyId?: string | null;
  setActiveReplyId?: React.Dispatch<React.SetStateAction<string | null>>;
  isReply?: boolean
  clickable?: boolean
}

interface CreateReplyResponse {
  comment: CommentResponse;
}

interface RepliesResponse {
  data: CommentResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}



export default function CommentItem({isReply, comment, activeReplyId,clickable, setActiveReplyId }: CommentItemProps) {

  const isActive = activeReplyId === comment.id.toString()
  const [reply, setReply] = useState("")
  const queryClient = useQueryClient();
  const [replies, setReplies] = useState<CommentResponse[]>(comment.replies ?? []);
  const [page, setPage] = useState({page: 1, repliesCount: replies.length})
  const [loading, setLoading] = useState(false)

  const [voteCount, setVoteCount] = useState(comment.vote);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(comment.userVote);
  const debouncedVote = useDebounce(voteCount, 3000);
  const router = useRouter()

const createReplyMutation = useApiMutation<CreateReplyResponse, CommentInfo>(
  `${BASE_URL}${ENDPOINTS.COMMENTS(comment.post_id)}`,
  {
    method: "POST",
    onError: (error: any) => {
        if (error?.status === 401) {
          toast.error("Please sign up to add replies!");
        } else if (error?.status === 429) {
          toast.error("Too many replies, please slow down!");
        } else {
          toast.error("Failed to create reply!");
        }
      },
    onSuccess: (newComment) => {
      setReply("");

      setReplies((prev) => [newComment.comment, ...prev]);
      setPage((prev) => ({
          ...prev,
          repliesCount: prev.repliesCount + 1
        }));

      queryClient.setQueryData(["comments", comment.post_id], (oldData: any) => {
        return {
          ...oldData,
          pages: oldData.pages?.map((eachPage: any) => {
            return {
              ...eachPage,
              items: eachPage.items.map((eachItem: any) => {
                if (eachItem.id === comment.id) {
                  return {
                    ...eachItem,
                    replies: [newComment.comment, ...(eachItem.replies ?? [])],
                    totalReplies: (eachItem.totalReplies ?? 0) + 1,
                  };
                } else {
                  return eachItem;
                }
              }),
            };
          }),
        };
      });
    },
  }
);


console.log(comment)
const handleFetchMoreReplies = async() => {
  setLoading(true)
  const replies = await apiClient<RepliesResponse>(`${BASE_URL}${ENDPOINTS.REPLIES(comment.id)}`, "GET", {}, {}, {page: page.toString(), repliesCount: page.repliesCount.toString()})

  setReplies((prev) => {
    return [...prev, ...(replies?.data?.data ?? [])];
  });

  setPage((prev) => ({
    page: prev.page + 1,
    repliesCount: prev.repliesCount + (replies.data?.data?.length ?? 0),
  }));
  setLoading(false)
}



const handleReply = () => {
  createReplyMutation.mutate({
    comment: reply.trim(),
    parent_id: comment.id,
  });
};


  const handleUpVote = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (userVote === "downvote") {
      setVoteCount((prev) => prev + 2);
      setUserVote("upvote");
      return;
    }

    if (userVote === "upvote") {
      setVoteCount((prev) => prev - 1);
      setUserVote(null);
      return;
    }

    setVoteCount((prev) => prev + 1);
    setUserVote("upvote");
  };

  const handleDownVote = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
  
      if (userVote === "upvote") {
        setVoteCount((prev) => prev - 2);
        setUserVote("downvote");
        return;
      }
  
      if (userVote === "downvote") {
        setVoteCount((prev) => prev + 1);
        setUserVote(null);
        return;
      }
  
      setVoteCount((prev) => prev - 1);
      setUserVote("downvote");
    };


    useEffect(() => {
      if (debouncedVote !== comment.vote) {
        apiClient(`${BASE_URL}/posts/${comment.id}/comments/vote`, "PATCH", { voteType: userVote });
      }
    }, [debouncedVote]);


    const handleClick = () => {
    if (clickable) {
      router.push(`../posts/${comment.post_id}`);
    }
};

console.log(comment)
  return (
    <div className={styles.mainContianer}>

    {!isReply && (
      <div
        className={
          (comment.replies?.length ?? 0) > 0
            ? styles.commentLine
            : ""
        }
      ></div>
    )}

    <div >
      <div onClick={handleClick} className={isReply ? styles.userReplyContainer : `${styles.userCommentContainer} ${clickable ? `${styles.commentClickable} ${styles.hover}` : {}}`}>
        <Avatar className={styles.profilePic} user={{username: comment.username, profilePic: comment.profile_pic ?? undefined}} />
        <div className={styles.userCommentInfo}>
          <div className={styles.usernameContainer}>
            <span className={styles.commentUsername}>{comment.username}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.commentTime}>{formatTimeAgo(comment.created_at)}</span>
          </div>
          <p className={styles.comment}>{comment.comment}</p>

          <div className={styles.commentStatsContainer}>
          <UpVote
            onClick={handleUpVote}
            width={20}
            height={20}
            stroke="green"
            className={`${styles.voteButtons} ${
              userVote === "upvote" ? styles.upvoted : ""
            }`}
          />
          <p className={styles.voteCount}>{voteCount}</p>
          <DownVote
            onClick={handleDownVote}
            width={20}
            height={20}
            stroke="red"
            className={`${styles.voteButtons} ${
              userVote === "downvote" ? styles.downvoted : ""
            }`}
          />
          
          {!isReply && <div onClick={() => setActiveReplyId?.(comment.id.toString())} className={styles.replyButtonContainer}>
            <Comment className={styles.replyIcon} width={15} height={15} />
            <span className={styles.reply}>Reply</span>
          </div>}

          
        </div>
        {isActive && 
        <div>
          <CustomAreaTextInput name="reply" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Add your reply"  />  
          <div className={styles.replyActionsContainer}>
            <button onClick={() => setActiveReplyId?.(null)} className={styles.discardButton}>Discard</button>
            <CustomButton loading={createReplyMutation.isPending} onClick={handleReply} className={`${ButtonStyles.primary_button} ${styles.replyButton}`} title="Reply" />
          </div>

        </div>}

        </div>
      </div>
    
    <div className={styles.repliesWrapper}>
      {replies?.map((eachReply) => (
        <CommentItem isReply={true} key={eachReply.id} comment={eachReply} />
      ))}
    </div>

    {!isReply && replies.length < (comment.totalReplies ?? 0) && (
      <>
      {loading ? <LoadingSpinner noMargin size="small" /> : <span onClick={handleFetchMoreReplies} className={styles.viewReplies}>
        View more replies
      </span>}</>
    )}

    </div> </div>
  );
}
