import { apiClient, ApiResponse } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Event } from "@/types/events";
import EventsClient from "./EventsClient";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { Suspense } from "react";

export default async function EventsPage() {
  const queryClient = new QueryClient();
  const defaultSort = "old";

  await queryClient.prefetchInfiniteQuery<Event[], Error>({
    queryKey: ["events", defaultSort],
    queryFn: async ({ pageParam = 1 }) => {
      const res: ApiResponse<{
        data: Event[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      }> = await apiClient(
        `${BASE_URL}${ENDPOINTS.EVENTS}?sort=${defaultSort}&page=${pageParam}&limit=10`
      );

      if (!res.ok) throw new Error(res.error ?? "Failed to fetch events");

      return res.data?.data ?? [];
    },
    getNextPageParam: (lastPage: Event[], allPages: Event[][]) => {
      if (!lastPage || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EventsClient dehydratedState={dehydratedState} />
    </Suspense>
  );
}
