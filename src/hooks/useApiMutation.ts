import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";

interface ApiMutationOptions<TData, TVariables> {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  queryKeyToInvalidate?: (string | unknown[])[];
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

export function useApiMutation<
  TData,
  TVariables extends Record<string, unknown> = Record<string, unknown>
>(
  url: string,
  options?: ApiMutationOptions<TData, TVariables>
): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const res = await apiClient<TData>(url, options?.method || "POST", variables);

     /*  if (!res.ok) {
        throw new Error(res.error || "API request failed");
      } */

         if (!res.ok) {
    throw res; // <-- Throw the whole response, not just Error
  }

      return res.data as TData;
    },
    onSuccess: (data) => {
      options?.queryKeyToInvalidate?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(key) ? key : [key],
        });
      });

      options?.onSuccess?.(data);
    },
    onError: (error: unknown) => options?.onError?.(error),
  });
}
