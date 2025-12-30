import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

import { getMember } from "@/lib/workspaces/utils";
import { Project } from "@/lib/projects/types";
import { Query } from "node-appwrite";
import { Task, TaskStatus } from "../tasks/types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

interface GetProjectProps {
  projectId: string;
}
export const getProject = async ({ projectId }: GetProjectProps) => {
  // const client = new Client()
  //   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  //   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // const session = cookies().get(AUTH_COOKIE);
  // if (!session) return null;

  // client.setSession(session.value);

  // const account = new Account(client);
  // const databases = new Databases(client);
  const { account, databases } = await createSessionClient();

  const user = await account.get();
  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });
  if (!member) throw new Error("Not a member of this project"); // make sure the current user is a member of the project

  return project;
};

interface GetProjectAnalyticsProps {
  projectId: string;
}
export const getProjectAnalytics = async ({
  projectId,
}: GetProjectAnalyticsProps) => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );
  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });

  if (!member) throw new Error("Not a member of this project");

  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const taskCount = thisMonthTasks.total;
  const taskDifference = taskCount - lastMonthTasks.total;

  const thisMonthAssignedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthAssignedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const assignedTaskCount = thisMonthAssignedTasks.total;
  const assignedTaskDifference = taskCount - lastMonthAssignedTasks.total;

  const thisMonthIncompleteTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthIncompleteTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const incompleteTaskCount = thisMonthIncompleteTasks.total;
  const incompleteTaskDifference =
    incompleteTaskCount - lastMonthIncompleteTasks.total;

  const thisMonthCompletedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthCompletedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const completedTaskCount = thisMonthCompletedTasks.total;
  const completedTaskDifference =
    completedTaskCount - lastMonthCompletedTasks.total;

  const thisMonthOverdueTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthOverdueTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]
  );

  const overdueTaskCount = thisMonthOverdueTasks.total;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

  return {
    data: {
      taskCount,
      taskDifference,

      assignedTaskCount,
      assignedTaskDifference,

      incompleteTaskCount,
      incompleteTaskDifference,

      completedTaskCount,
      completedTaskDifference,

      overdueTaskCount,
      overdueTaskDifference,
    },
  };
};
