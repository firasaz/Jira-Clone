import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Project } from "@/lib/projects/types";
import { Task } from "@/lib/tasks/types";

import { Button } from "@/components/ui/button";
import { ProjectsAvatar } from "@/components/projects/projects-avatar";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useDeleteTask } from "@/hooks/tasks/use-delete-task";
import { useConfirm } from "@/hooks/workspaces/use-confirm";

interface TaskBreadCrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadCrumbsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();

  const [ConfrimDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );
  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      {
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      <ConfrimDialog />
      <ProjectsAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-5 lg:size-6"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className={cn(
          "ml-auto basis-full sm:basis-auto",
          isPending && "animate-pulse"
        )}
        variant={"destructive"}
        size={"sm"}
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <TrashIcon className="lg:mr-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};
