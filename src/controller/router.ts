import { Express } from "express";
import {
  POST_USERS_CONTROLLER,
  postUsersController,
} from "./post-users.controller";
import { body } from "express-validator";

export function router(app: Express) {
  app.post(
    POST_USERS_CONTROLLER,
    body("password")
      .isString()
      .custom((input: string) => {
        console.log(input);
        if (input.length < 10) {
          throw new Error("password should be more than 10 letters");
        }

        return true;
      }),
    postUsersController,
  );
}
