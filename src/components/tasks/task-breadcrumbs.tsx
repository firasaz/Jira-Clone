import { Project } from "@/lib/projects/types";
import { Task } from "@/lib/tasks/types";
import { ProjectsAvatar } from "../projects/projects-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

interface TaskBreadCrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadCrumbsProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
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
        className="ml-auto basis-full sm:basis-auto"
        variant={"destructive"}
        size={"sm"}
      >
        <TrashIcon className="lg:mr-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};
