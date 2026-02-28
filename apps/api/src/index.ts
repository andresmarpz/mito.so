import { Hono } from "hono";
import { cors } from "hono/cors";
import { and, eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { bookmark } from "@/db/schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.use(
  cors({
    origin: (origin) => origin,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const createBookmarkSchema = z.object({
  url: z.string().url(),
});

app.post("/api/bookmarks", zValidator("json", createBookmarkSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { url } = c.req.valid("json");

  const [created] = await db
    .insert(bookmark)
    .values({
      url,
      userId: session.user.id,
    })
    .returning();

  return c.json(created, 201);
});

app.get("/api/bookmarks", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const bookmarks = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.userId, session.user.id))
    .orderBy(desc(bookmark.createdAt));

  return c.json(bookmarks);
});

app.delete("/api/bookmarks/:id", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { id } = c.req.param();

  const [deleted] = await db
    .delete(bookmark)
    .where(and(eq(bookmark.id, id), eq(bookmark.userId, session.user.id)))
    .returning();

  if (!deleted) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true });
});

export default app;
