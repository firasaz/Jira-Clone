import { MoreHorizontalIcon } from "lucide-react";

import { Task } from "@/lib/tasks/types";

import { TaskDate } from "@/components/tasks/task-date";
import { TaskActions } from "@/components/tasks/task-actions";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/components/members/members-avatar";
import { ProjectsAvatar } from "@/components/projects/projects-avatar";

interface KanbanCardProps {
  task: Task;
}
export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex justify-between items-start gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions taskId={task.$id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} fallbackClassName="text-xs" />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectsAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-xs"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
