import { PencilIcon } from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";

import { Task } from "@/lib/tasks/types";

import { useEditTaskModal } from "@/hooks/tasks/use-edit-task-modal";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/components/members/members-avatar";
import { TaskDate } from "@/components/tasks/task-date";
import { OverviewProperty } from "@/components/tasks/task-details/overview-property";

interface TaskOverviewProps {
  task: Task;
}
export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            onClick={() => open(task.$id)}
            size={"sm"}
            variant={"secondary"}
          >
            <PencilIcon className="mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          {/* Status */}
          <OverviewProperty label="Status">
            <Badge variant={task.status} className="text-white">
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
