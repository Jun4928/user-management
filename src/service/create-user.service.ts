import { SALT_ROUNDS } from "../constant";
import { USER_DUPLICATED, UserDatabase } from "../database/user-database";
import { User } from "../types/user";
import bcrypt from "bcrypt";

type CreateUserInput = {
  name: string;
  password: string;
};

type CreateUserOutput = Promise<User>;

export async function createUser(
  params: CreateUserInput,
  userDatabase: UserDatabase,
): CreateUserOutput {
  const hashed = await bcrypt.hash(params.password, SALT_ROUNDS);
  const created = await userDatabase.create({
    name: params.name,
    password: hashed,
  });

  if ("succeed" in created) {
    if (!created.succeed && created.reason === USER_DUPLICATED) {
      throw new Error(USER_DUPLICATED);
    }

    throw new Error(`INTERNAL SERVER ERROR`);
  }

  return created;
}
