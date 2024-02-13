import { Express } from "express";
import {
  POST_USERS_CONTROLLER,
  postUsersController,
} from "./post-users.controller";
import { body } from "express-validator";
import {
  POST_USERS_AUTHENTICATION_CONTROLLER,
  postUsersAuthenticationController,
} from "./post-users-authentication.controller";

export function router(app: Express) {
  app.post(
    POST_USERS_CONTROLLER,
    body("name").isString(),
    body("password")
      .isString()
      .custom((input: string) => {
        if (input.length < 10) {
          throw new Error("password should be more than 10 letters");
        }

        return true;
      }),
    postUsersController,
  );

  app.post(
    POST_USERS_AUTHENTICATION_CONTROLLER,
    body("name").isString(),
    body("password").isString(),
    postUsersAuthenticationController,
  );
}
