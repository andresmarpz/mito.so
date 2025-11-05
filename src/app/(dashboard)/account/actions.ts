"use server";
import { revalidatePath } from "next/cache";
import { UserInsert } from "~/db/schema";
import { userService } from "~/services";

export const updateUserAction = async (user: Partial<UserInsert>) => {
  const updatedUser = await userService.updateUser(user);
  revalidatePath("/account");

  return updatedUser;
};
