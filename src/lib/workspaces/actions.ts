import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { getMember } from "@/lib/workspaces/utils";
import { Workspace } from "@/lib/workspaces/types";
import { createSessionClient } from "../appwrite";

export const getWorkspaces = async () => {
  try {
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
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
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
    if (!member) return null; // make sure the current user can fetch this workspace

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspaceData = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
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
  } catch {
    return null;
  }
};
