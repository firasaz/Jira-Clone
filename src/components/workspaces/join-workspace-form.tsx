"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "../dotted-separator";
import { Button } from "@/components/ui/button";

import { useInviteCode } from "@/hooks/workspaces/use-invite-code";
import { useJoinWorkspace } from "@/hooks/workspaces/use-join-workspace";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinPageProps {
  initialValues: {
    name: string;
  };
}
export const JoinWorkspaceForm = ({ initialValues }: JoinPageProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();

  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <Button
            className="w-full lg:w-fit"
            variant={"secondary"}
            type="button"
            disabled={isPending}
            size={"lg"}
            asChild
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
            size={"lg"}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
