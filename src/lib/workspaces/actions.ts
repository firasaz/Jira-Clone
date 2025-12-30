import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";

import { getMember } from "@/lib/workspaces/utils";
import { Workspace } from "@/lib/workspaces/types";
import { createSessionClient } from "../appwrite";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Task, TaskStatus } from "../tasks/types";

export const getWorkspaces = async () => {
  // const client = new Client()
  //   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  //   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // const session = cookies().get(AUTH_COOKIE);
  // if (!session) return { documents: [], total: 0 };

  // client.setSession(session.value);

  // const account = new Account(client);
  // const databases = new Databases(client);
  const { account, databases } = await createSessionClient();

  // get currently logged in user
  const currentUser = await account.get();
  // filter members by current/logged in user id
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", currentUser.$id),
  ]);
  if (members.total === 0) return { documents: [], total: 0 };

  // fetch all workspaces in db
  const workspaceIds = members.documents.map(member => member.workspaceId);
  // filter out workspaces only related to current/logged in user id
  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.contains("$id", workspaceIds),
    Query.orderDesc("$createdAt"),
  ]);

  return workspaces;
};

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
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
  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId,
  });
  if (!member) throw new Error("Unauthorized"); // make sure the current user can fetch this workspace

  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );

  return workspace;
};

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspaceData = async ({ workspaceId }: GetWorkspaceProps) => {
  // const client = new Client()
  //   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  //   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // const session = cookies().get(AUTH_COOKIE);
  // if (!session) return null;

  // client.setSession(session.value);

  // const account = new Account(client);
  // const databases = new Databases(client);
  const { databases } = await createSessionClient();

  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );

  return {
    name: workspace.name,
  };
};

interface GetWorkspaceAnalyticsProps {
  workspaceId: string;
}
export const getWorkspaceAnalytics = async ({
  workspaceId,
}: GetWorkspaceAnalyticsProps) => {
  console.log(workspaceId);
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const member = await getMember({
    databases,
    workspaceId,
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
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
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
      Query.equal("workspaceId", workspaceId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthAssignedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
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
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthIncompleteTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
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
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]
  );
  const lastMonthCompletedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("workspaceId", workspaceId),
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
      Query.equal("workspaceId", workspaceId),
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
      Query.equal("workspaceId", workspaceId),
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
