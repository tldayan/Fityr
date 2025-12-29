
import ClientProfileTabs from "./_components/ClientProfileTabs/ClientProfileTabs";
import { ProfileTab } from "@/types/profile";
import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { UserProfileResponse } from "@/types/user";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

interface Props {
  params: { username: string };
  searchParams: { content?: string };
}


const TAB_MAP: Record<string, ProfileTab> = {
  events: "Events",
  posts: "Posts",
  comments: "Comments",
};


export default async function Page({ params, searchParams }: Props) {
  const { username } = params;

    const selected: ProfileTab = TAB_MAP[searchParams.content ?? "posts"] ?? "Posts"

    const userProfile = await apiClient<UserProfileResponse>(
      `${BASE_URL}${ENDPOINTS.USERS.GET_USER_PROFILE}/${username}`,
      "GET"
    );


  const user = userProfile.data;

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <ClientProfileTabs
        username={username}
        user={user}
        selected={selected}
      />
    </div>
  );
}
