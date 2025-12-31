"use client";

import { Task } from "@/lib/tasks/types";
import { Button } from "../../ui/button";
import { useCreateTaskModal } from "@/hooks/tasks/use-create-task-modal";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { DottedSeparator } from "../../dotted-separator";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { Card, CardContent } from "../../ui/card";
import { formatDistanceToNow } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  total: number;
}
export const TaskList = ({ tasks, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1 min-h-0">
      <div className=" flex flex-col h-full bg-muted rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Tasks {total}</p>
          <Button variant={"muted"} size={"icon"} onClick={() => createTask()}>
            <PlusIcon className="size-4 text-neutral" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4 overflow-y-auto">
          {tasks.map(task => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="">{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="szie-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};
