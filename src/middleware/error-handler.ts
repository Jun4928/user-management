import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const { message } = err;
  console.error(message);
  console.error(err.stack);
  res.status(500).json({ errorMessage: "Internal Server Error" });
}
