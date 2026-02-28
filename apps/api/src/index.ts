import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({
  origin: (origin) => origin,
  credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app
