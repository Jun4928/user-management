import { RequestHandler } from "express";
import { EmptyObject } from "../types/utility-types";
import { createUser } from "../service/create-user.service";
import { InMemoryUser, USER_DUPLICATED } from "../database/user-database";
import { validationResult } from "express-validator";
import { Tspec } from "tspec";

export const POST_USERS_CONTROLLER = "/users" as const;

type PostUsersControllerBody = { name: string; password: string };

type PostUsersControllerResponse = { id: number } | { errorMessage: string };

type PostUsersController = RequestHandler<
  EmptyObject,
  PostUsersControllerResponse,
  PostUsersControllerBody,
  EmptyObject
>;

export type PostUsersControllerApiSpec = Tspec.DefineApiSpec<{
  paths: {
    "/users": {
      post: {
        summary: "create a user";
        handler: PostUsersController;
      };
    };
  };
}>;

export const postUsersController: PostUsersController = async function (
  req,
  res,
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errorMessage: errors.array().at(0)?.msg ?? "BAD INPUT" });
    }

    const user = await createUser(req.body, InMemoryUser);

    res.status(201).json({ id: user.id });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === USER_DUPLICATED) {
        res.status(409).json({ errorMessage: USER_DUPLICATED });
      }
    }

    throw new Error(`INTERNAL SERVER ERROR`);
  }
};
