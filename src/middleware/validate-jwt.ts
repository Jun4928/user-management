import { Request, Response, NextFunction } from "express";
import { jwtImpl } from "../lib/jwt";
import { InMemoryUser } from "../database/user-database";

export async function validateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bearer, token] = req.headers.authorization?.split(" ") ?? [
    "",
    "INVALID_TOKEN",
  ];

  try {
    const authenticatedUser = jwtImpl.verify(token);
    const foundUser = await InMemoryUser.getOne(authenticatedUser.name);
    res.locals.authenticatedUser = foundUser;
    next();
  } catch (error) {
    return res.status(401).json({ errorMessage: "Not Authenticated" });
  }
}
