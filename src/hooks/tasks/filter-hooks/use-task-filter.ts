import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "@/lib/tasks/types";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    dueDate: parseAsString,
    search: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
  });
};
