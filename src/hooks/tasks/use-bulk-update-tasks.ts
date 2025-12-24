import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks["bulk-update"]["$post"]({ json });
      if (!res.ok) throw new Error("Failed to update tasks");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Task updated");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update tassk");
    },
  });

  return mutation;
};
