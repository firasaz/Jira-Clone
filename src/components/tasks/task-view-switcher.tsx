"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DottedSeparator } from "../dotted-separator";
import { useCreateTaskModal } from "@/hooks/tasks/use-create-task-modal";

export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();

  return (
    <Tabs className="flex-1 w-full border rounded-lg">
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
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Data table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
