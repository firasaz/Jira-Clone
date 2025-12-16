"use client";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { ArrowLeftIcon, Loader, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "../dotted-separator";
import { useGetMembers } from "@/hooks/members/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "../members/members-avatar";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteMember } from "@/hooks/members/use-delete-member";
import { useUpdateMember } from "@/hooks/members/use-update-member";
import { useConfirm } from "@/hooks/workspaces/use-confirm";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: "ADMIN" | "MEMBER") => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };
  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload(); // reload the page to protect route if user delete theirselves
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          data?.documents.map((member, index) => (
            <Fragment key={member.$id}>
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <Badge
                    variant={member.role === "MEMBER" ? "secondary" : "default"}
                    className="text-xs rounded-full font-mono"
                  >
                    {member.role.toLowerCase()}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant={"secondary"}
                        size={"icon"}
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => handleUpdateMember(member.$id, "ADMIN")}
                        disabled={isUpdating}
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => handleUpdateMember(member.$id, "MEMBER")}
                        disabled={isUpdating}
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeleting}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {index < data.documents.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          ))
        )}
      </CardContent>
    </Card>
  );
};
