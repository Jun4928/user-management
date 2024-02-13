import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { EmptyObject } from "../types/utility-types";
import { Tspec } from "tspec";
import { validationResult } from "express-validator";
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
  authenticateUser,
} from "../service/authenticate-user.service";
import { InMemoryUser } from "../database/user-database";
import { jwtImpl } from "../lib/jwt";

export const POST_USERS_AUTHENTICATION_CONTROLLER =
  "/users/authentication" as const;

type PostUsersAuthenticationControllerBody = { name: string; password: string };

type PostUsersAuthenticationControllerResponse =
  | { token: string }
  | { errorMessage: string };

type PostUsersAuthenticationController = RequestHandler<
  EmptyObject,
  PostUsersAuthenticationControllerResponse,
  PostUsersAuthenticationControllerBody,
  EmptyObject
>;

export type PostUsersAuthenticationControllerApiSpec = Tspec.DefineApiSpec<{
  paths: {
    "/users/authentication": {
      post: {
        summary: "authenticate a user, if succeed, returns a jwt token";
        handler: PostUsersAuthenticationController;
      };
    };
  };
}>;

export const postUsersAuthenticationController: PostUsersAuthenticationController =
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errorMessage: errors.array().at(0)?.msg ?? "BAD INPUT" });
    }

    try {
      const token = await authenticateUser(req.body, InMemoryUser, jwtImpl);
      res.json({ token });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === USER_NOT_FOUND_ERROR ||
          error.message === WRONG_PASSWORD_ERROR
        ) {
          return res.status(401).json({ errorMessage: error.message });
        }
      }

      throw new Error(`INTERNAL SERVER ERROR`);
    }
  };
