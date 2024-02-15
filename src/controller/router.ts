import { Express } from "express";
import {
  POST_USERS_CONTROLLER,
  postUsersController,
} from "./post-users.controller";
import { body, param } from "express-validator";
import {
  POST_USERS_AUTHENTICATION_CONTROLLER,
  postUsersAuthenticationController,
} from "./post-users-authentication.controller";
import {
  GET_USERS_VEHICLES_CONTROLLER,
  getUsersVehiclesController,
} from "./get-users-vehicles.controller";
import { validateJwt } from "../middleware/validate-jwt";
import {
  GET_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
  getUsersVehiclesVehicleIdController,
} from "./get-users-vehicle-vehicle-id.controller";

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

  app.get(
    GET_USERS_VEHICLES_CONTROLLER,
    validateJwt as any,
    getUsersVehiclesController,
  );

  app.get(
    GET_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
    param("vehicleId").isString().isNumeric(),
    validateJwt as any,
    getUsersVehiclesVehicleIdController,
  );
}
