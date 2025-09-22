"use server";

import { Console, Effect } from "effect";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

import { createClient } from "~/utils/supabase/server";

const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).max(32).nonempty(),
});

export const login = async (formData: FormData) =>
  Effect.runPromise(
    Effect.gen(function* () {
      yield* Console.log("Initializing login..");

      yield* Console.log(formData.entries());

      const credentials = loginSchema.parse(Object.fromEntries(formData));

      const supabase = yield* Effect.promise(createClient);

      const result = yield* Effect.promise(() =>
        supabase.auth.signInWithPassword(credentials)
      );

      if (result.error) {
        redirect("/auth/error");
      }

      revalidatePath("/", "layout");
      redirect("/");
    })
  );

const signupSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).max(32).nonempty(),
});

export const signup = async (formData: FormData) =>
  Effect.runPromise(
    Effect.gen(function* () {
      yield* Console.log("Signing up user");

      const credentials = signupSchema.parse(Object.fromEntries(formData));

      const supabase = yield* Effect.promise(createClient);

      const result = yield* Effect.promise(() =>
        supabase.auth.signUp(credentials)
      );
      if (result.error) {
        redirect("/auth/error");
      }

      revalidatePath("/", "layout");
      redirect("/");
    })
  );
