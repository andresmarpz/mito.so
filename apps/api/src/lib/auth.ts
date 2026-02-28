import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";

import { db } from "../db/client";

import * as schema from "../db/schema";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    camelCase: true,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const appUrl = new URL(url);
        appUrl.host = new URL(process.env.APP_URL!).host;
        // TODO: send email with a proper email provider
        console.log(`Magic link for ${email}: ${appUrl.toString()}`);
      },
    }),
  ],
});
