"use client";
import { useCallback } from "react";

import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { TaskStatus } from "@/lib/tasks/types";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DottedSeparator } from "@/components/dotted-separator";
import { columns } from "@/components/tasks/columns";
import { DataTable } from "@/components/tasks/views/table/data-table";
import { DataFilters } from "@/components/tasks/data-filters";
import { DataKanban } from "@/components/tasks/views/kanban/data-kanban";

import { useGetTasks } from "@/hooks/tasks/use-get-tasks";
import { useCreateTaskModal } from "@/hooks/tasks/use-create-task-modal";
import { useTaskFilters } from "@/hooks/tasks/filter-hooks/use-task-filter";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useBulkUpdateTasks } from "@/hooks/tasks/use-bulk-update-tasks";

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [{ projectId, assigneeId, search, dueDate, status }] = useTaskFilters();

  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    search,
    dueDate,
    status,
  });
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    []
  );
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="flex flex-col h-full overflow-auto p-4">
        <div className="flex flex-col justify-between items-center gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size={"sm"}
            className="w-full lg:w-auto"
            onClick={() => open()}
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex flex-col justify-center items-center w-full border rounded-lg h-[200px]">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              {/* {JSON.stringify(tasks)} */}
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Data calendar
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
