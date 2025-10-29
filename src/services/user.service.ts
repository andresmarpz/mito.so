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
  }
>() {}

export const UserServiceLive = Layer.effect(
  UserService,
  Effect.gen(function* () {
    const userRepository = yield* UserRepository;

    return yield* Effect.succeed({
      createUser: (user: UserInsert) =>
        Effect.gen(function* () {
          return yield* userRepository.createUser(user);
        }),
      getUserByEmail: (email: string) =>
        Effect.gen(function* () {
          return yield* userRepository.getUserByEmail(email);
        }),
    });
  })
).pipe(Layer.provide(UserRepositoryLive));
