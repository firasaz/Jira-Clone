import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";

import { useConfirm } from "@/hooks/workspaces/use-confirm";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { useDeleteTask } from "@/hooks/tasks/use-delete-task";

interface TaskActionProps {
  taskId: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({
  taskId,
  projectId,
  children,
}: TaskActionProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId } });
  };

  const onOpenTask = () =>
    router.push(`/workspaces/${workspaceId}/tasks/${taskId}`);
  const onOpenProject = () =>
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          {/* Edit task */}
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="font-medium p-2"
          >
            <PencilIcon className="size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          {/* Open Project */}
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DottedSeparator className="my-1" />
          {/* Delete Task */}
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-2"
          >
            <TrashIcon className="size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
