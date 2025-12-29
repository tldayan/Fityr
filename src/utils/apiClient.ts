export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

export const apiClient = async <T = unknown>(
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

    const errorMessage =
      response.ok
        ? null
        : (responseData as any)?.error?.toString() || `HTTP ${response.status}`;

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? responseData : null,
      error: errorMessage,
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
