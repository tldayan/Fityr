import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import SearchResultsWrapper from "./SearchResultsWrapper";
import { PostItemProps, UserProps } from "@/types/postTypes";
import { Suspense } from "react";

type InitialData =
  | { posts: PostItemProps[]; users?: never }
  | { users: UserProps[]; posts?: never };


export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const searchTerm = Array.isArray(params?.searchterm)
    ? params.searchterm[0]
    : params?.searchterm ?? "";

  const rawType = Array.isArray(params?.type)
    ? params.type[0]
    : params?.type;

  const type: "users" | "posts" = rawType === "posts" ? "posts" : "users";

  const data = searchTerm
    ? await apiClient<InitialData>(
        `${BASE_URL}${ENDPOINTS.SEARCH}`,
        "GET",
        {} as Record<string, unknown>,
        {} as Record<string, unknown>,
        { searchTerm, type }
      )
    : null;

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsWrapper initialData={data?.data ?? null} type={type} />
    </Suspense>
  );
}
