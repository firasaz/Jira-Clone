import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetMembersProps {
  workspaceId: string;
}
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId], // adding workspaceId here will force a refresh of the members when the workspaceId changes
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch members");

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
