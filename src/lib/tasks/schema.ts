import z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Status Required" }),
  workspaceId: z.string().trim().min(1, "WorkspaceId Required"),
  projectId: z.string().trim().min(1, "ProjectId Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "AssigneeId required"),
  description: z.string().optional(),
});
