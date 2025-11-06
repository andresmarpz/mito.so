"use server";

import { Cause, Exit, Option } from "effect";
import { revalidatePath } from "next/cache";
import { UserInsert } from "~/db/schema";
import { createServerAction } from "~/effect/server-action-wrapper";
import { BaseHttpError, isBaseHttpError } from "~/exceptions/base.exceptions";
import { userService } from "~/services";

// export const updateUserAction = async (user: Partial<UserInsert>) => {
//   const exit = await userService.updateUser(user);

//   if (Exit.isSuccess(exit)) {
//     revalidatePath("/account");
//     return exit.value;
//   } else {
//     const cause = Cause.squash(exit.cause);
//     if (isBaseHttpError(cause)) {
//       return {
//         status: cause.status,
//         message: cause.message,
//         error_code: cause.error_code,
//       } satisfies BaseHttpError;
//     } else {
//       return {
//         status: 500,
//         message: "An unknown error occurred during user update.",
//         error_code: "UNKNOWN_ERROR",
//       } satisfies BaseHttpError;
//     }
//   }
// };

export const updateUserAction = createServerAction({
  handler: async (user: Partial<UserInsert>) => {
    return await userService.updateUser(user);
  },
  onSuccess: () => {
    revalidatePath("/account");
  },
  onError: (error) => {
    console.error(error);
  },
});
