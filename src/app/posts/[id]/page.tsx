import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import PostClient from "./PostClient";
import { Post } from "@/types/postTypes";
import { cookies } from "next/headers";
import { JSX } from "react";

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage({
  params,
}: PostPageProps): Promise<JSX.Element> {
  const { id } = params;

  const cookieStore = await cookies();
  const jwt = cookieStore.get("stytch_session_jwt")?.value;

  const res = await apiClient<Post>(
    `${BASE_URL}${ENDPOINTS.POSTS}/${id}`,
    "GET",
    {},
    {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : "",
      },
    }
  );

  if (!res.ok || !res.data) {
    throw new Error(`Failed to fetch post: ${res.error}`);
  }

  return <PostClient post={res.data} />;
}
