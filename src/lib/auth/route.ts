import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "./schemas";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), context => {
    const { email, password } = context.req.valid("json");

    return context.json({
      success: true,
      data: { email, password },
    });
  })
  .post("/register", zValidator("json", registerSchema), c => {
    const req = c.req.valid("json");

    return c.json(req);
  });
export default app;
