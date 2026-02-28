import { drizzle } from "drizzle-orm/bun-sql";

import * as schema from "@/db/schema";

const databaseUrl = Bun.env.DATABASE_URL ?? "postgresql://mito:mito@localhost:5432/mito";

export const db = drizzle(databaseUrl, {
  schema,
});
