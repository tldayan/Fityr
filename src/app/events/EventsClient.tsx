"use client";

import { useInfiniteData } from "@/hooks/useInfiniteQuery";
import { Event } from "@/types/events";
import { ENDPOINTS } from "@/_lib/apiEndpoints";
import { HydrationBoundary } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import EventItem from "@/components/EventItem/EventItem";
import styles from "./page.module.css"
import CustomButton from "@/components/CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css"
import { useEffect, useState } from "react";
import shadowStyles from "@/app/globalStyles/containerShadowStyles.module.css"
import { useRouter } from "next/navigation";

export default function EventsClient({ dehydratedState }: any) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <EventsContent />
    </HydrationBoundary>
  );
}

function EventsContent() {
  const [showHostButton, setShowHostButton] = useState(false);
  const router = useRouter()

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY) {
        setShowHostButton(true);
      } else {
        setShowHostButton(false);
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteData<Event>({
    key: ["events"],
    endpoint: ENDPOINTS.EVENTS.BASE,
    limit: 10,
  });

  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  

  const allEvents = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <h1>Events</h1>
      <div className={styles.eventsListContainer}>
        {allEvents.map((e) => (
          <EventItem key={e.id} event={e} />
        ))}
      </div>
        
      <div className={`${styles.hostWrapper} ${showHostButton ? styles.show : styles.hide}`}>
        <CustomButton
          className={`${ButtonStyles.primary_button} ${styles.attendEventButton}`}
          title="Host an Event"
          onClick={() => router.push("/createEvent")}
        />
      </div>

      <div ref={loadMoreRef} style={{ textAlign: "center", padding: "1rem" }}>
        {(isFetchingNextPage || hasNextPage || isLoading) && <LoadingSpinner />}
      </div>
    </>
  );
}
