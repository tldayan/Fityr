import { useStytch } from "@stytch/nextjs";

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

export const useApiClient = () => {
  const stytchClient = useStytch();

  const apiClient = async <T = unknown>(
    url: string,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
    data: Record<string, unknown> = {},
    options: RequestInit = {},
    queryParams: Record<string, string> = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const queryString = Object.keys(queryParams).length
        ? `?${new URLSearchParams(queryParams).toString()}`
        : "";
      const finalUrl = `${url}${queryString}`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: "include",
        ...options,
        ...(Object.keys(data).length > 0 && method !== "GET"
          ? { body: JSON.stringify(data) }
          : {}),
      };

      const response = await fetch(finalUrl, fetchOptions);
      const responseData: T | null = await response.json().catch(() => null);

     
      if (response.status === 401) {
        try {
          await stytchClient.session.revoke();
        } catch (err) {
          console.error("Automatic logout failed:", err);
        }

        return {
          ok: false,
          status: 401,
          data: null,
          error: "Unauthorized",
        };
      }

      return {
        ok: response.ok,
        status: response.status,
        data: response.ok ? responseData : null,
        error: response.ok
          ? null
          : ((responseData as any)?.error as string) || `HTTP ${response.status}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return {
        ok: false,
        status: 0,
        data: null,
        error: message,
      };
    }
  };

  return apiClient;
};
