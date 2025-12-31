import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient, createSessionClient } from "../appwrite";
import { getMember } from "../workspaces/utils";
import { Member } from "./types";
import { Query } from "node-appwrite";

interface GetMembersProps {
  workspaceId: string;
}
export const getMembers = async ({ workspaceId }: GetMembersProps) => {
  const { account, databases, users } = await createAdminClient();

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
  // map over the Appwrite respone of members list and add "name" and "email" fields to each document in the list
  const populatedMembers = await Promise.all(
    members.documents.map(async member => {
      const user = await users.get(member.userId);
      return {
        ...member,
        name: user.name,
        email: user.email,
        role: member.role,
      };
    })
  );
  return {
    ...members,
    documents: populatedMembers,
  };
};
