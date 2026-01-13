import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.auth.logout["$post"]();
      if (!res.ok) throw new Error("Failed to logout");

      return await res.json();
    },
    // refetch the client data to clear the session data in the frontend
    onSuccess: () => {
      toast.success("Logged out");

      router.refresh();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return mutation;
};
