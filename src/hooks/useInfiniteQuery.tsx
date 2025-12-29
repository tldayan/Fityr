import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, ApiResponse } from "@/utils/apiClient";
import { BASE_URL } from "@/_lib/apiEndpoints";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InfinitePage<T> {
  items: T[];
  meta: PaginationMeta;
}

interface UseInfiniteDataOptions {
  key: string | unknown[];
  endpoint: string;
  limit?: number;
  enabled?: boolean;
}

export function useInfiniteData<T>({ key, endpoint, limit = 10, enabled = true }: UseInfiniteDataOptions) {
  return useInfiniteQuery<InfinitePage<T>, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async ({ pageParam = 1 }) => {
      const page = Number(pageParam);
      const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${page}&limit=${limit}`;
      const res: ApiResponse<{ data?: T[]; meta?: PaginationMeta }> = await apiClient(url);
      if (!res.ok) throw new Error(res.error ?? "Failed to fetch data");

      return {
        items: res?.data?.data ?? [],
        meta: res?.data?.meta ?? { page, totalPages: page, total: res?.data?.data?.length ?? 0, limit },
      };
    },
    getNextPageParam: (lastPage) => {
  if (!lastPage?.meta) return undefined;
  return lastPage.meta.page < lastPage.meta.totalPages
    ? lastPage.meta.page + 1
    : undefined;
},
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled,
  });
}

