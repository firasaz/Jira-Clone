import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

import { getMember } from "@/lib/workspaces/utils";
import { Project } from "@/lib/projects/types";

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

// interface GetProjectAnalyticsProps {
//   projectId: string;
// }
// export const getProjectAnalytics = async ({ projectId }: GetProjectAnalyticsProps) => {

// }
