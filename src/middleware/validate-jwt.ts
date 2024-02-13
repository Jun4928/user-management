import { Request, Response, NextFunction } from "express";
import { jwtImpl } from "../lib/jwt";
import { InMemoryUser } from "../database/user-database";
import { User } from "../types/user";

declare global {
  module Express {
    export interface Request {
      authenticatedUser: User | null;
    }
  }
}

export async function validateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [bearer, token] = req.headers.authorization?.split(" ") ?? [
    "",
    "INVALID_TOKEN",
  ];
  const authenticatedUser = jwtImpl.verify(token);
  const foundUser = await InMemoryUser.getOne(authenticatedUser.name);
  req.authenticatedUser = foundUser;
  next();
}
