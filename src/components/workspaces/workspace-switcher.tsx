"use client";

import { useRouter } from "next/navigation";

import { Loader } from "lucide-react";
import { RiAddCircleFill } from "react-icons/ri";

import { useGetWorkspaces } from "@/hooks/workspaces/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useCreateWorkspaceModal } from "@/hooks/workspaces/use-create-workspace-modal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/components/workspaces/workspace-avatar";
import { Skeleton } from "@/components/ui/skeleton";

const WorkspaceSwitcherSkeleton = () => {
  return (
    <Skeleton className="h-12 w-full rounded-md flex justify-center items-center">
      <Loader className="size-5 animate-spin" />
    </Skeleton>
  );
};

export const WorkspaceSwitcher = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { data: workspaces, isLoading } = useGetWorkspaces();

  const { open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {isLoading ? (
        <WorkspaceSwitcherSkeleton />
      ) : (
        <Select onValueChange={onSelect} value={workspaceId}>
          <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 focus:ring-0">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.documents.map(workspace => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
