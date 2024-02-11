import { UserDatabase } from "../database/user-database";
import { User } from "../types/user";
import bcrypt from "bcrypt";

type AuthenticateUserInput = {
  name: string;
  password: string;
};

type AuthenticateUserOutput = Promise<User>;

export async function authenticateUser(
  params: AuthenticateUserInput,
  userDatabase: UserDatabase,
): AuthenticateUserOutput {
  const user = await userDatabase.getOne(params.name);

  if (user == null) {
    throw new Error(`NOT FOUND ERROR`);
  }

  const compared = await bcrypt.compare(params.password, user.password);
  if (!compared) {
    throw new Error(`WRONG PASSWORD`);
  }

  return user;
}
