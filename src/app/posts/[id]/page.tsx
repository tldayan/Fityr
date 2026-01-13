import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import PostClient from "./PostClient";
import { Post } from "@/types/postTypes";

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage({ params }: PostPageProps) {

  const { id } = await params;

  const res = await apiClient<Post>(`${BASE_URL}${ENDPOINTS.POSTS}/${id}`);

  if (!res.ok || !res.data) {
    throw new Error(`Failed to fetch post: ${res.error}`);
  }


  return <PostClient post={res.data} />;
}
