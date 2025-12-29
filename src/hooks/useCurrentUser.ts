import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: () => { throw new Error("No fetch needed — user is in cache"); },
    initialData: () => queryClient.getQueryData<User>(["me"]) ?? null,
  });
};
