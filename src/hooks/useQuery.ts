import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";

interface ApiQueryOptions<TData>
  extends Omit<UseQueryOptions<TData, any>, "queryKey" | "queryFn"> {
  queryParams?: Record<string, string>;
}

export function useApiQuery<TData>(
  url: string,
  options?: ApiQueryOptions<TData>
) {
  const queryParamsString = options?.queryParams
    ? JSON.stringify(options.queryParams)
    : "";

  return useQuery<TData, any>({
    queryKey: [url, queryParamsString],
    queryFn: async () => {
      const res = await apiClient(url, "GET", {}, {}, options?.queryParams);
      if (!res.ok) throw new Error(res.error || "API Error");
      return res.data as TData;
    },
    ...options,
  });
}
