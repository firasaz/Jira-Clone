import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { ID, Query } from "node-appwrite";

import z from "zod";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/lib/workspaces/schemas";
import { getMember } from "@/lib/workspaces/utils";
import { Workspace } from "@/lib/workspaces/types";

import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { generateInviteCode } from "@/lib/utils";

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { getWorkspaceAnalytics } from "./actions";

const app = new Hono()
  .get("/", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const currentUser = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", currentUser.$id),
    ]);
    if (members.total === 0)
      return c.json({ data: { documents: [], total: 0 } });

    const workspaceIds = members.documents.map(member => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async c => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        //       In Node (server) using the Node Appwrite SDK (node-appwrite),
        // getFileView() does NOT return a URL.
        // It returns a Promise that resolves to an ArrayBuffer (file bytes).

        // const arrayBuffer = await storage.getFilePreview(
        //   IMAGES_BUCKET_ID,
        //   file.$id
        // );
        // uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        //   arrayBuffer
        // ).toString("base64")}`;
        // Construct the URL manually — this works for Node SDK
        uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(10),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: "ADMIN",
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async c => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      // check if the user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== "ADMIN")
        return c.json({ error: "Unauthorized" }, 401);

      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
      } else uploadedImageUrl = image;
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  // TODO: Delete members, projects, and tasks APIs
  .delete("/:workspaceId", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== "ADMIN")
      return c.json({ error: "Unauthroized" }, 401);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId); // delete document takes 3 params: appwrite db id, appwrite table id, & the document id to be deleted

    return c.json({ data: { $id: workspaceId } }); // mimick the appwrite response structure by using "$id" inside the data key
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== "ADMIN")
      return c.json({ error: "Unauthroized" }, 401);

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(),
      }
    ); // delete document takes 3 params: appwrite db id, appwrite table id, & the document id to be deleted

    return c.json({ data: workspace }); // mimick the appwrite response structure by using "$id" inside the data key
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async c => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) return c.json({ error: "Already a member" }, 400);

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code)
        return c.json({ error: "Invalid invite code" }, 400);

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: "MEMBER",
      });

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId/analytics", async c => {
    const { workspaceId } = c.req.param();
    const analyticsData = await getWorkspaceAnalytics({ workspaceId });

    return c.json(analyticsData);
  });

export default app;
