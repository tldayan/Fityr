'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostItem from '../PostItem/PostItem';
import styles from './Feed.module.css';
import {  ENDPOINTS } from '@/_lib/apiEndpoints';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ChipSelector from '../ChipSelector/ChipSelector';
import {
  DehydratedState,
  HydrationBoundary,
} from '@tanstack/react-query';
import { useInfiniteData } from '@/hooks/useInfiniteQuery';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Post } from '@/types/postTypes';
import buttonStyles from "../../app/globalStyles/buttonStyles.module.css"
import Link from 'next/link';


interface FeedClientProps {
  dehydratedState?: DehydratedState | null;
}

export default function FeedClient({ dehydratedState }: FeedClientProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <FeedContent />
    </HydrationBoundary>
  );
}

function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortParam = searchParams?.get("sort") ?? "new";
  const sortType = sortParam.charAt(0).toUpperCase() + sortParam.slice(1).toLowerCase();

  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteData<Post>({
    key: ['posts', sortType ? sortType : "New"],
    endpoint: `${ENDPOINTS.POSTS}?sort=${sortType.toLowerCase()}`,
    limit: 10,
  });

  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSortChange = (value: string) => {
    router.push(`?sort=${value.toLowerCase()}`);
  };

  if (error) return <div>Error: {error.message}</div>;


  const allPosts = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className={styles.FeedContainer}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.actionsContainer}>
            <ChipSelector selected={sortType} onChange={handleSortChange} options={["New", "Old", "Best"]} />
            <Link href={"/createpost"} className={`${buttonStyles.noBackground} ${styles.createPostButton}`}>Create post</Link>
          </div>
          {allPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <PostItem
                id={post.id}
                title={post.title}
                description={post.description}
                created_at={post.created_at}
                username={post.username}
                vote={post.vote}
                commentCount={post.commentCount}
                userVote={post.userVote}
                images={post.images}
              />

     
              {index < allPosts.length - 1 && <hr className={styles.divider} />}
            </React.Fragment>
          ))}

     
          <div ref={loadMoreRef} style={{ textAlign: "center", padding: "1rem" }}>
            {(isFetchingNextPage || hasNextPage) && <LoadingSpinner />}
          </div>
        </>
      )}
    </div>
  );
}