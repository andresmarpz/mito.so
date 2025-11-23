import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/db";
import * as schema from "~/db/schema";
import { emailOTP, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "Mito",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    nextCookies(),
    username(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(email, otp, type);
      },
    }),
  ],
  emailAndPassword: {
    enabled: false,
  },
});
