import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>["json"];

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async req => {
      const res = await client.api.auth.register["$post"]({ json: req });
      return await res.json();
    },
  });

  return mutation;
};
