import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";

const app = new Hono();

app.use(
  cors({
    origin: (origin) => origin,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
