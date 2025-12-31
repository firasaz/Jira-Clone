import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../workspaces/utils";
import { Query } from "node-appwrite";
import { Task, TaskStatus } from "./types";
import { DATABASE_ID, TASKS_ID } from "@/config";

interface GetTasksProps {
  workspaceId: string;
  projectId?: string;
}
export const getTasks = async ({ workspaceId, projectId }: GetTasksProps) => {
  const { account, databases } = await createSessionClient();

  const currentUser = await account.get();
  const isMember = await getMember({
    databases,
    userId: currentUser.$id,
    workspaceId,
  });
  //   if (!isMember) throw new Error("User is not a member of this workspace.");
  if (!isMember) throw new Error("Unauthorized");

  const query = [
    Query.equal("workspaceId", workspaceId),
    Query.orderDesc("$createdAt"),
  ];
  if (projectId) query.push(Query.equal("projectId", projectId));
  if (projectId) query.push(Query.equal("status", Object.values(TaskStatus)));

  const tasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    query
  );

  return tasks;
};
