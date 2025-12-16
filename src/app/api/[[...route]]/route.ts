// Entry point for Hono

import { Hono } from "hono";
import { handle } from "hono/vercel";

// the import name "auth" can be anything here
import auth from "@/lib/auth/route";
import workspaces from "@/lib/workspaces/route";
import members from "@/lib/members/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/members", members);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
