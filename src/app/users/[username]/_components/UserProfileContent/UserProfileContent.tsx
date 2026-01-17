import React from 'react';
import { ENDPOINTS } from '@/_lib/apiEndpoints';
import CommentItem from '@/components/CommentItem/CommentItem';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import PostItem from '@/components/PostItem/PostItem';
import { useInfiniteData } from '@/hooks/useInfiniteQuery';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Post } from '@/types/postTypes';
import styles from "./UserProfileContent.module.css"
import globalStyles from "../../../../page.module.css"
import EventItem from '@/components/EventItem/EventItem';
import { Event } from '@/types/events';


interface UserProfileContentProps {
  profileSort: 'Posts' | 'Comments' | "Events";
  username: string;
}

export default function UserProfileContent({
  profileSort,
  username,
}: UserProfileContentProps) {

  const postsQuery = useInfiniteData<Post>({
    key: ['userContent', username, 'posts'],
    endpoint: `${ENDPOINTS.USERS.GET_USER_CONTENT_TYPE}?contentType=posts&username=${username}`,
    limit: 10,
    enabled: profileSort === 'Posts',
  });

  const posts = postsQuery.data?.pages.flatMap(page => page.items) ?? [];

  const eventsQuery = useInfiniteData<Event>({
    key: ['userContent', username, 'events'],
    endpoint: `${ENDPOINTS.USERS.GET_USER_CONTENT_TYPE}?contentType=events&username=${username}`,
    limit: 10,
    enabled: profileSort === 'Events',
  });

  const events = eventsQuery.data?.pages.flatMap(page => page.items) ?? [];

  const commentsQuery = useInfiniteData<CommentResponse>({
    key: ['userContent', username, 'comments'],
    endpoint: `${ENDPOINTS.USERS.GET_USER_CONTENT_TYPE}?contentType=comments&username=${username}`,
    limit: 10,
    enabled: profileSort === 'Comments',
  });

  const comments = commentsQuery.data?.pages.flatMap(page => page.items) ?? [];
  const activeQuery = profileSort === 'Posts' ? postsQuery : commentsQuery;
  console.log("comments",comments)
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = activeQuery;

  const loadMoreRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  );

  return (
    <div className={styles.contentListContainer}>
    {isLoading && <LoadingSpinner />}

    {!isLoading && profileSort === 'Posts' && posts.length === 0 && (
      <p className={styles.emptyNotice}>No posts yet…</p>
    )}

    {!isLoading && profileSort === 'Events' && events.length === 0 && (
      <p className={styles.emptyNotice}>No events yet…</p>
    )}

    {!isLoading && profileSort === 'Comments' && comments.length === 0 && (
      <p className={styles.emptyNotice}>No comments yet…</p>
    )}


      {profileSort === 'Posts'
        ? posts.map((post, index) => (
          <React.Fragment key={post.id}>
            <PostItem
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              username={post.username}
              created_at={post.created_at}
              vote={post.vote}
              commentCount={post.commentCount}
              userVote={post.userVote}
              images={post.images}
            />
            {index < posts.length - 1 && <hr className={globalStyles.divider} />}
          </React.Fragment>
          ))
        : profileSort === "Events" ? 

          events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))

          : 
          comments.map(comment => ( 
            <CommentItem clickable={true} key={comment.id} comment={comment} />
          ))}

      <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '1rem' }}>
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  );
}
