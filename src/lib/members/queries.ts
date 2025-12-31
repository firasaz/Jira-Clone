import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createSessionClient } from "../appwrite";
import { getMember } from "../workspaces/utils";
import { Member } from "./types";
import { Query } from "node-appwrite";

interface GetMembersProps {
  workspaceId: string;
}
export const getMembers = async ({ workspaceId }: GetMembersProps) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();
  const member = await getMember({
    databases,
    workspaceId,
    userId: user.$id,
  });
  if (!member) throw new Error("Unauthorized");

  if (member.role !== "ADMIN") throw new Error("Unauthorized");

  const members = await databases.listDocuments<Member>(
    DATABASE_ID,
    MEMBERS_ID,
    [Query.equal("workspaceId", workspaceId)]
  );
  return members;
};
