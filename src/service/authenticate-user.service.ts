import { UserDatabase } from "../database/user-database";
import { JWT } from "../lib/jwt";
import bcrypt from "bcrypt";

type AuthenticateUserInput = {
  name: string;
  password: string;
};

type AuthenticateUserOutput = Promise<string>;

export const USER_NOT_FOUND_ERROR = `NOT FOUND ERROR`;
export const WRONG_PASSWORD_ERROR = `WRONG PASSWORD`;

export async function authenticateUser(
  params: AuthenticateUserInput,
  userDatabase: UserDatabase,
  jwt: JWT,
): AuthenticateUserOutput {
  const user = await userDatabase.getOne(params.name);

  if (user == null) {
    throw new Error(USER_NOT_FOUND_ERROR);
  }

  const compared = await bcrypt.compare(params.password, user.password);
  if (!compared) {
    throw new Error(WRONG_PASSWORD_ERROR);
  }

  return jwt.sign({ id: user.id, name: user.name });
}
