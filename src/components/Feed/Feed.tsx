import FeedClient from './FeedClient';
import { apiClient, ApiResponse } from '@/utils/apiClient';
import { BASE_URL, ENDPOINTS } from '@/_lib/apiEndpoints';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { Post } from '@/types/postTypes';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export default async function Feed() {
  const queryClient = new QueryClient();
  const defaultSort = 'New';

  await queryClient.prefetchInfiniteQuery({
  queryKey: ['posts', defaultSort],
  queryFn: async ({ pageParam = 1 }) => {
    const res: ApiResponse<{ data?: Post[]; meta?: PaginationMeta }> =
      await apiClient(
        `${BASE_URL}${ENDPOINTS.POSTS}?sort=${defaultSort.toLowerCase()}&page=${pageParam}&limit=10`
      );

    if (!res.ok) throw new Error(res.error ?? "Failed to fetch posts");

    return {
      items: res.data?.data ?? [],
      meta: res.data?.meta ?? {
        page: pageParam,
        totalPages: pageParam,
        total: res.data?.data?.length ?? 0,
        limit: 10,
      },
    };
  },
  getNextPageParam: (lastPage: { items: Post[]; meta: PaginationMeta }) =>
  lastPage.meta.page < lastPage.meta.totalPages
    ? lastPage.meta.page + 1
    : undefined,
  initialPageParam: 1,
});


  const dehydratedState = dehydrate(queryClient);
  return <FeedClient dehydratedState={dehydratedState} />;
}
