import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id),
    firstName: text("first_name"),
    lastName: text("last_name"),
    username: text("username").notNull(),
    profilePicture: text("profile_picture"),
    email: text("email").notNull(),
  },
  (table) => [
    unique().on(table.email),
    unique().on(table.id),
    unique().on(table.username),
  ]
);

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
