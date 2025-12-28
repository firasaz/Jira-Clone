import { MemberAvatar } from "@/components/members/members-avatar";
import { ProjectsAvatar } from "@/components/projects/projects-avatar";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { Member } from "@/lib/members/types";
import { Project } from "@/lib/projects/types";
import { TaskStatus } from "@/lib/tasks/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    assignee: Member;
    project: Project;
    status: TaskStatus;
    // [key: string]: any;
  };
}
const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

export const EventCard = ({
  event: { id, title, assignee, project, status },
}: EventCardProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };
  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs text-primary bg-white border border-l-4 rounded-md flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectsAvatar name={project?.name} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  );
};
