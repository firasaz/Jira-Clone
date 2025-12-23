import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.tasks[":taskId"]["$patch"]({ json, param });
      if (!res.ok) throw new Error("Failed to update task");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task created");

      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  return mutation;
};
