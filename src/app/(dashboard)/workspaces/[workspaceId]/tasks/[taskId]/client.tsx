"use client";

import { PageError } from "@/components/layout/page-error";
import { PageLoader } from "@/components/layout/page-loader";
import { TaskBreadcrumbs } from "@/components/tasks/task-breadcrumbs";
import { TaskDescription } from "@/components/tasks/task-details/task-description";
import { TaskOverview } from "@/components/tasks/task-details/task-overview";
import { DottedSeparator } from "@/components/dotted-separator";

import { useGetTask } from "@/hooks/tasks/use-get-task";
import { useTaskId } from "@/hooks/tasks/use-task-id";

export const TaskIdClient = () => {
  const taskId = useTaskId();

  const { data, isLoading, isError } = useGetTask({ taskId });

  if (isLoading) return <PageLoader />;
  if (isError || !data) return <PageError message="Task not found" />;

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
