import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { Task } from "@/lib/tasks/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { DottedSeparator } from "@/components/dotted-separator";

import { useUpdateTask } from "@/hooks/tasks/use-update-task";

interface TaskDescriptionProps {
  task: Task;
}
export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();
  const handleSave = () => {
    mutate({
      json: { description: value },
      param: { taskId: task.$id },
    });
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Description</p>
        <Button
          onClick={() => setIsEditing(prev => !prev)}
          size={"sm"}
          variant={"secondary"}
          className="w-24 flex justify-center"
        >
          {isEditing ? (
            <>
              <XIcon />
              Cancel
            </>
          ) : (
            <>
              <PencilIcon />
              Edit
            </>
          )}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={e => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            size={"sm"}
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};
