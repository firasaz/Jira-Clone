import { Models } from "node-appwrite";

export enum MemberStatus {
  "ADMIN" = "ADMIN",
  "MEMBER" = "MEMBER",
}
export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberStatus;
};
