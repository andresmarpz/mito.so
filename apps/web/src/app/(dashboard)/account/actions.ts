"use server";

import { revalidatePath } from "next/cache";
import { UserInsert } from "~/db/schema";
import { createServerAction } from "~/effect/server-action-wrapper";
import { userService } from "~/services";

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
