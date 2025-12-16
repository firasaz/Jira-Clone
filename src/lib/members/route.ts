import { Hono } from "hono";
import { sessionMiddleware } from "../sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { createAdminClient } from "../appwrite";
import { getMember } from "../workspaces/utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async c => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      // map over the Appwrite respone of members list and add "name" and "email" fields to each document in the list
      const populatedMembers = await Promise.all(
        members.documents.map(async member => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      // keep Appwrite response as is and modify the "documents" field to use the modified documents list
      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async c => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

    if (member.$id !== memberToDelete.$id && member.role !== "ADMIN")
      return c.json({ error: "Unauthorized" }, 401);

    if (allMembersInWorkspace.total === 1)
      return c.json({ error: "Cannot delete the only member" }, 400);

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.enum(["ADMIN", "MEMBERS"]) })),
    async c => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const user = c.get("user");
      const databases = c.get("databases");

      const memberUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      if (member.role !== "ADMIN")
        return c.json({ error: "Unauthorized" }, 401);

      if (allMembersInWorkspace.total === 1)
        return c.json({ error: "Cannot downgrade the only member" }, 400);

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberId } });
    }
  );

export default app;
