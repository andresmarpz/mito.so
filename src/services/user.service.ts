import { Context, Effect, Layer } from "effect";
import { UserInsert, UserSelect } from "~/db/schema";
import {
  UserRepository,
  UserRepositoryLive,
} from "~/repositories/user.repository";

export class UserService extends Context.Tag("UserService")<
  UserService,
  {
    createUser: (user: UserInsert) => Effect.Effect<UserSelect, Error, never>;
    getUserByEmail: (email: string) => Effect.Effect<UserSelect, Error, never>;
    getUserById: (userId: string) => Effect.Effect<UserSelect, Error, never>;
    updateUser: (
      user: Partial<UserInsert>
    ) => Effect.Effect<UserSelect, Error, never>;
  }
>() {}

export const UserServiceLive = Layer.effect(
  UserService,
  Effect.gen(function* () {
    const userRepository = yield* UserRepository;

    return yield* Effect.succeed({
      getUserById: (userId: string) =>
        Effect.gen(function* () {
          return yield* userRepository.getUserById(userId);
        }),
      createUser: (user: UserInsert) =>
        Effect.gen(function* () {
          return yield* userRepository.createUser(user);
        }),
      getUserByEmail: (email: string) =>
        Effect.gen(function* () {
          return yield* userRepository.getUserByEmail(email);
        }),
      updateUser: (user: Partial<UserInsert>) =>
        Effect.gen(function* () {
          return yield* userRepository.updateUser(user);
        }),
    });
  })
).pipe(Layer.provide(UserRepositoryLive));
