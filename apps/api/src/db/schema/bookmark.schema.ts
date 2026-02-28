import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

export const bookmarkTypeEnum = pgEnum("bookmark_type", [
  "website",
  "article",
  "video",
  "image",
  "audio",
  "document",
  "other",
]);

export const bookmarkMetadataStatusEnum = pgEnum("bookmark_metadata_status", [
  "pending",
  "processing",
  "succeeded",
  "failed",
]);

export const bookmark = pgTable(
  "bookmark",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    normalizedUrl: text("normalizedUrl"),
    title: text("title"),
    description: text("description"),
    siteName: text("siteName"),
    faviconUrl: text("faviconUrl"),
    imageUrl: text("imageUrl"),
    type: bookmarkTypeEnum("type").notNull().default("website"),
    metadataStatus: bookmarkMetadataStatusEnum("metadataStatus").notNull().default("pending"),
    metadataFetchedAt: timestamp("metadataFetchedAt"),
    metadataError: text("metadataError"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("bookmark_userId_idx").on(table.userId),
    index("bookmark_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("bookmark_metadataStatus_idx").on(table.metadataStatus),
  ],
);

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
}));
