import { Context, Effect, Layer } from "effect";
import { UserInsert, users, UserSelect } from "~/db/schema";
import { db } from "~/db";
import { eq } from "drizzle-orm";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    createUser: (user: UserInsert) => Effect.Effect<UserSelect, Error, never>;
    getUserByEmail: (email: string) => Effect.Effect<UserSelect, Error, never>;
    getUserById: (userId: string) => Effect.Effect<UserSelect, Error, never>;
    updateUser: (
      user: Partial<UserInsert>
    ) => Effect.Effect<UserSelect, Error, never>;
  }
>() {}

export const UserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* () {
    const database = yield* Effect.sync(() => db);

    return yield* Effect.succeed({
      getUserById: (userId: string) =>
        Effect.gen(function* () {
          const results = yield* Effect.tryPromise({
            try: () =>
              database.select().from(users).where(eq(users.id, userId)),
            catch: (error: unknown) => {
              if (error instanceof Error) {
                console.error(error);
                return new Error(error.message);
              }

              return new Error("Failed to get user by ID");
            },
          });

          if (results.length) {
            return yield* Effect.succeed(results[0]);
          } else {
            return yield* Effect.fail(new Error("User not found"));
          }
        }),
      createUser: (user: UserInsert) =>
        Effect.gen(function* () {
          const results = yield* Effect.tryPromise({
            try: () =>
              database
                .insert(users)
                .values(user)
                .onConflictDoNothing()
                .returning(),
            catch: (error: unknown) => {
              if (error instanceof Error) {
                console.error(error);
                return new Error(error.message);
              }

              return new Error("Failed to create user");
            },
          });

          if (results.length) {
            return yield* Effect.succeed(results[0]);
          } else {
            return yield* Effect.fail(new Error("User already exists"));
          }
        }),
      getUserByEmail: (email: string) =>
        Effect.gen(function* () {
          const results = yield* Effect.tryPromise({
            try: () =>
              database
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1),
            catch: (error: unknown) => {
              if (error instanceof Error) {
                console.error(error);
                return new Error(error.message);
              }

              return new Error("Failed to get user by email");
            },
          });

          if (results.length) {
            return yield* Effect.succeed(results[0]);
          } else {
            return yield* Effect.fail(new Error("User not found"));
          }
        }),
      updateUser: (user: Partial<UserInsert>) =>
        Effect.gen(function* () {
          if (!user.id) {
            return yield* Effect.fail(new Error("User ID is required"));
          }

          const results = yield* Effect.tryPromise({
            try: () =>
              database
                .update(users)
                .set(user)
                .where(eq(users.id, user.id as string))
                .returning(),
            catch: (error: unknown) => {
              if (error instanceof Error) {
                console.error(error);
                return new Error(error.message);
              }

              return new Error("Failed to update user");
            },
          });

          if (results.length) {
            return yield* Effect.succeed(results[0]);
          } else {
            return yield* Effect.fail(new Error("User not found"));
          }
        }),
    });
  })
);
