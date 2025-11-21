import { createAuthClient } from "better-auth/react";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   baseURL: env.BETTER_AUTH_URL,
// });
export const authClient = createAuthClient({
  plugins: [usernameClient(), emailOTPClient()],
});
