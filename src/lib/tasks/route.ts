import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { ID, Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { sessionMiddleware } from "../sessionMiddleware";
import { createTaskSchema } from "./schema";

import { getMember } from "../workspaces/utils";
import z from "zod";
import { Task, TaskStatus } from "./types";
import { createAdminClient } from "../appwrite";
import { Project } from "../projects/types";
import { Member } from "../members/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async c => {
      const { users } = await createAdminClient();

      const user = c.get("user");
      const databases = c.get("databases");

      const form = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId: form.workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const query = [
        Query.equal("workspaceId", form.workspaceId),
        Query.orderDesc("$createdAt"),
      ];
      if (form.projectId) query.push(Query.equal("projectId", form.projectId));
      if (form.status) query.push(Query.equal("status", form.status));
      if (form.assigneeId)
        query.push(Query.equal("assigneeId", form.assigneeId));
      if (form.dueDate) query.push(Query.equal("dueDate", form.dueDate));
      if (form.search) query.push(Query.search("name", form.search));

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map(task => task.projectId);
      const assigneeIds = tasks.documents.map(task => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async member => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map(task => {
        const project = projects.documents.find(
          project => project.$id === task.projectId
        );
        const assignee = assignees.find(
          assignee => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async c => {
      const user = c.get("user");
      const databases = c.get("databases");

      const form = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId: form.workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", form.status),
          Query.equal("workspaceId", form.workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );
      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;
      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          ...form,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete("/:taskId", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);
    // return c.json({ data: { $id: taskId } })
    return c.json({ data: { $id: task.$id } });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async c => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { taskId } = c.req.param();
      const form = c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );
      if (!existingTask) return c.json({ error: "Not Found" }, 404);

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name: form.name,
          status: form.status,
          projectId: form.projectId,
          assigneeId: form.assigneeId,
          dueDate: form.dueDate,
          description: form.description,
        }
      );

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async c => {
    const { users } = await createAdminClient();

    const currentUser = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });
    if (!currentMember) return c.json({ error: "Unauthorized" }, 401);

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );
    const member = await databases.getDocument<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);
    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({ data: { ...task, project, assignee } });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async c => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tasks } = await c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map(task => task.$id)
          ),
        ] // check if the $id in the tasks in the db is in the list of task ids generated by the map
      );
      const workspaceIds = new Set(
        tasksToUpdate.documents.map(task => task.workspaceId)
      ); // use Set feature to check if tasks are from different workspaces or not

      if (workspaceIds.size !== 1)
        return c.json(
          { error: "All tasks must be in the same workspace" },
          401
        );

      const workspaceId = workspaceIds.values().next().value;
      if (!workspaceId)
        return c.json({ error: "No workspace linked to this task" }, 400);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const updatedTasks = await Promise.all(
        tasks.map(async task => {
          const { $id, status, position } = task;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
