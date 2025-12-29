import {
  FolderIcon,
  // Funnel,
  ListChecksIcon,
  UserIcon,
} from "lucide-react";

import { useGetMembers } from "@/hooks/members/use-get-members";
import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useTaskFilters } from "@/hooks/tasks/filter-hooks/use-task-filter";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { TaskStatus } from "@/lib/tasks/types";
// import { cn, snakeCaseToTitleCase } from "@/lib/utils";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

// interface DropdownMenuItemsProps {
//   currentStatus: TaskStatus | null;
//   onClick: (task: TaskStatus) => void;
// }
// const DropdownMenuItems = ({
//   onClick,
//   currentStatus,
// }: DropdownMenuItemsProps) => {
//   const taskStatuses = Object.values(TaskStatus) as TaskStatus[];
//   return (
//     <>
//       {taskStatuses.map(status => (
//         <DropdownMenuItem
//           className={cn(
//             "hover:bg-secondary hover:outline-none px-3 py-1.5 rounded flex justify-between items-center text-sm",
//             currentStatus === status && "bg-secondary font-medium"
//           )}
//           onSelect={() => onClick(status)}
//         >
//           {snakeCaseToTitleCase(status)}
//           {currentStatus === status && <Check className="size-3 opacity-75" />}
//         </DropdownMenuItem>
//       ))}
//     </>
//   );
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map(project => ({
    value: project.$id,
    label: project.name,
  }));
  const memberOptions = members?.documents.map(member => ({
    value: member.$id,
    label: member.name,
  }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ projectId, assigneeId, search, dueDate, status }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    if (value === "all") setFilters({ status: null });
    else setFilters({ status: value as TaskStatus });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  // const handleDropdownClick = (task: TaskStatus) => {
  //   if (!task) return;
  //   // e.preventDefault();
  //   onStatusChange(task);
  // };
  // const TASK_STATUS_SET = new Set<string>(Object.values(TaskStatus));
  // function isTaskStatus(value: unknown): value is TaskStatus {
  //   console.log(typeof value === "string" && TASK_STATUS_SET.has(value));
  //   return typeof value === "string" && TASK_STATUS_SET.has(value);
  // }

  if (isLoading)
    return (
      <div className="flex h-12 gap-2 overflow-x-hidden">
        <Skeleton className="w-36 h-8 flex-shrink-0" />
        <Skeleton className="w-36 h-8 flex-shrink-0" />
        <Skeleton className="w-36 h-8 flex-shrink-0" />
        <Skeleton className="w-36 h-8 flex-shrink-0" />
      </div>
    );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto">
        {/* Status */}
        <Select
          defaultValue={status ?? undefined}
          onValueChange={value => onStatusChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <ListChecksIcon className="size-4 mr-2" />
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectSeparator />
            <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
            <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          </SelectContent>
        </Select>
        {/* Assignee */}
        <Select
          defaultValue={assigneeId ?? undefined}
          onValueChange={value => onAssigneeChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <UserIcon className="size-4 mr-2" />
              <SelectValue placeholder="All assignees" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectSeparator />
            {memberOptions?.map(member => (
              <SelectItem key={member.value} value={member.value}>
                {member.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Project */}
        {!hideProjectFilter && (
          <Select
            defaultValue={projectId ?? undefined}
            onValueChange={value => onProjectChange(value)}
          >
            <SelectTrigger className="w-full lg:w-auto h-8">
              <div className="flex items-center pr-2">
                <FolderIcon className="size-4 mr-2" />
                <SelectValue placeholder="All projects" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              <SelectSeparator />
              {projectOptions?.map(project => (
                <SelectItem key={project.value} value={project.value}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {/* Due Date */}
        <DatePicker
          placeholder="Due Date"
          className="h-8 w-full lg:w-auto"
          value={dueDate ? new Date(dueDate) : undefined}
          onChange={date =>
            setFilters({ dueDate: date ? date.toISOString() : null })
          }
        />
      </div>
      {/* <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus:outline-none">
            <Button size={"icon"} variant={"secondary"}>
              <Funnel />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-1">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <div className="flex items-center pr-2">
                  <ListChecksIcon className="size-4 mr-2" />
                  All statuses
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className="p-1 w-40"
                  defaultValue={status ?? undefined}
                >
                  <DropdownMenuItem
                    className={cn(
                      "hover:bg-secondary hover:outline-none px-3 py-1.5 rounded flex justify-between items-center text-sm",
                      !isTaskStatus(status) && "bg-secondary font-medium"
                    )}
                    onSelect={() => onStatusChange("all")}
                  >
                    All statuses
                    {!isTaskStatus(status) && (
                      <Check className="size-3 opacity-75" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItems
                    currentStatus={status}
                    onClick={handleDropdownClick}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </div>
  );
};
