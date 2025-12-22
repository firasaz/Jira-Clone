import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Databases, Query } from "node-appwrite";
import { Member } from "../members/types";

interface GetMemeberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemeberProps) => {
  const members = await databases.listDocuments<Member>(
    DATABASE_ID,
    MEMBERS_ID,
    [Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)]
  );
  return members.documents[0];
};
