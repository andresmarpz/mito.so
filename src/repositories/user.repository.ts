import { Context, Effect, Layer } from "effect";
import { UserInsert, users, UserSelect } from "~/db/schema";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { PostgresError } from "postgres";
import { BaseHttpTaggedError } from "~/exceptions/base.exceptions";

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    createUser: (user: UserInsert) => Effect.Effect<UserSelect, Error, never>;
    getUserByEmail: (email: string) => Effect.Effect<UserSelect, Error, never>;
    getUserById: (userId: string) => Effect.Effect<UserSelect, Error, never>;
    updateUser: (
      user: Partial<UserInsert>
    ) => Effect.Effect<
      UserSelect,
      UsernameAlreadyExistsError | UserUpdateError,
      never
    >;
  }
>() {}

export class UserUpdateError extends BaseHttpTaggedError<{
  cause?: unknown;
}>("UserUpdateError") {}

export class UsernameAlreadyExistsError extends BaseHttpTaggedError<{
  cause?: unknown;
}>("UsernameAlreadyExistsError") {}

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
            return yield* Effect.fail(
              new UserUpdateError({
                message: "User ID is required",
                error_code: "USER_ID_REQUIRED",
                status: 400,
              })
            );
          }

          const results = yield* Effect.tryPromise({
            try: () =>
              database
                .update(users)
                .set(user)
                .where(eq(users.id, user.id as string))
                .returning(),
            catch: (error: unknown) => {
              if (error instanceof Error && error.cause) {
                const postgresError = error.cause as PostgresError;
                if (
                  postgresError.code === "23505" &&
                  postgresError.constraint_name?.includes("username_unique")
                ) {
                  return new UsernameAlreadyExistsError({
                    message: "Username already exists",
                    error_code: "USERNAME_ALREADY_EXISTS",
                    status: 400,
                  });
                }
              }

              if (error instanceof Error) {
                return new UserUpdateError({
                  cause: error,
                  message: error.message,
                  error_code: "USER_UPDATE_ERROR",
                  status: 500,
                });
              }

              return new UserUpdateError({
                cause: error,
                message: "Failed to update user",
                error_code: "USER_UPDATE_ERROR",
                status: 500,
              });
            },
          });

          if (results.length) {
            return yield* Effect.succeed(results[0]);
          } else {
            return yield* Effect.fail(
              new UserUpdateError({
                message: "User not found",
                error_code: "USER_NOT_FOUND",
                status: 404,
              })
            );
          }
        }),
    });
  })
);
