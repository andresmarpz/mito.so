import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username").notNull(),
  profilePicture: text("profile_picture"),
});
