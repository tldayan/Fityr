
import { useRef, useEffect, useCallback } from "react";

export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean | undefined
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const current = loadMoreRef.current;
    if (current && observerRef.current) observerRef.current.observe(current);

    return () => {
      if (current && observerRef.current) observerRef.current.unobserve(current);
    };
  }, [handleObserver]);

  return loadMoreRef;
}
