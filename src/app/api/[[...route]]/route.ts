// Entry point for Hono

import { Hono } from "hono";
import { handle } from "hono/vercel";

// the import name "auth" can be anything here
import auth from "@/lib/auth/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
