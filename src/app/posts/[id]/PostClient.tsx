"use client";

import { useState } from "react";
import styles from "./page.module.css";
import PostItem from "@/components/PostItem/PostItem";
import CustomButton from "@/components/CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css"
import { useApiMutation } from "@/hooks/useApiMutation";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import CommentItem from "@/components/CommentItem/CommentItem";
import { useInfiniteData } from "@/hooks/useInfiniteQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types/postTypes";
import toast from "react-hot-toast";
import CustomAreaTextInput from "@/components/CustomTextAreaInput/CustomTextAreaInput";



export default function PostClient({ post }: { post: Post }) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);


  const createCommentMutation = useApiMutation<CommentResponse, CommentInfo>(
    `${BASE_URL}${ENDPOINTS.COMMENTS(post.id)}`,
    {
      method: "POST",
      onError: (error: any) => {
        if (error?.status === 401) {
          toast.error("Please sign up to add comments!");
        } else if (error?.status === 429) {
          toast.error("Too many comments, please slow down!");
        } else {
          toast.error("Failed to create comment!");
        }
      },
      onSuccess: (newComment) => {
        setComment("");
        queryClient.setQueryData(
          ["comments", post.id],
          (oldData: any) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  items: [newComment.comment, ...firstPage.items],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        );
      },
    }
  );



const handleComment = () => {
  createCommentMutation.mutate({
    comment: comment.trim(),
    parent_id: null,
  });
};



const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  error,
} = useInfiniteData<CommentResponse>({
  key: ["comments", post.id],
  endpoint: `${ENDPOINTS.COMMENTS(post.id)}`,
  limit: 10,
});

console.log(data)


  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div className={`${styles.postContainer}`}>
      <PostItem
        id={post.id}
        username={post.username}
        title={post.title}
        vote={post.vote}
        description={post.description}
        created_at={post.created_at}
        commentCount={post.commentCount}
        userVote={post.userVote}
        images={post.images}
      >
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>
      </PostItem>

      <div className={styles.commentContainer}>
        <CustomAreaTextInput
          name={comment}
          value={comment}
          placeholder="Add your comment"
          onChange={(e) => setComment(e.target.value)}
        />
        {comment && <CustomButton loading={createCommentMutation.isPending} className={`${ButtonStyles.primary_button} ${styles.commentButton}`} onClick={handleComment} title="Comment" />}
      </div>





{isLoading ? (
  <LoadingSpinner />

) : error ? (

  <p className={styles.emptyPostsNotice}>NEW ERROR: {error.message}</p>

) : (data?.pages?.flatMap((p) => p.items).length ?? 0) > 0 ? (

  data?.pages.flatMap((page) =>
    page.items ?? []
  ).map((eachComment) => (
    <CommentItem
      isReply={false}
      key={eachComment.id}
      comment={eachComment}
      activeReplyId={activeReplyId}
      setActiveReplyId={setActiveReplyId}
    />
  ))

) : (

  <p className={styles.emptyPostsNotice}>Wow, such empty...</p>
)}


<div ref={loadMoreRef} style={{ textAlign: "center", padding: "1rem" }}>
  {(isFetchingNextPage || hasNextPage) && <LoadingSpinner />}
</div>


    </div>
  );
}
