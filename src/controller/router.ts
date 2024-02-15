import { Express } from "express";
import { body, param } from "express-validator";
import {
  POST_USERS_CONTROLLER,
  postUsersController,
} from "./post-users.controller";
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
} from "./get-users-vehicles-vehicle-id.controller";
import {
  POST_USERS_VEHICLES,
  postUsersVehiclesController,
} from "./post-users-vehicles.controller";
import { FOUR_DIGITS_YEAR } from "./internal/regexp";
import {
  PUT_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
  putUsersVehiclesVehicleIdController,
} from "./put-users-vehicles-vehicle-id.controller";
import {
  DELETE_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
  deleteUsersVehiclesVehicleIdController,
} from "./delete-users-vehicles-vehicle-id.controller";

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
    validateJwt as any,
    param("vehicleId")
      .isString()
      .customSanitizer((v) => Number(v)),
    getUsersVehiclesVehicleIdController,
  );

  app.post(
    POST_USERS_VEHICLES,
    validateJwt as any,
    body("brand").isString(),
    body("model").isString(),
    body("year").custom((v: unknown) => {
      if (typeof v !== "number") {
        throw new Error(`${v} should be number`);
      }

      if (FOUR_DIGITS_YEAR.test(v.toString()) === false) {
        throw new Error(`${v} should be four digits`);
      }

      return true;
    }),
    postUsersVehiclesController,
  );

  app.put(
    PUT_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
    validateJwt as any,
    param("vehicleId")
      .isString()
      .customSanitizer((v) => Number(v)),
    body("brand").isString(),
    body("model").isString(),
    body("year").custom((v: unknown) => {
      if (typeof v !== "number") {
        throw new Error(`${v} should be number`);
      }

      if (FOUR_DIGITS_YEAR.test(v.toString()) === false) {
        throw new Error(`${v} should be four digits`);
      }

      return true;
    }),
    putUsersVehiclesVehicleIdController,
  );

  app.delete(
    DELETE_USERS_VEHICLES_VEHICLE_ID_CONTROLLER,
    validateJwt as any,
    param("vehicleId")
      .isString()
      .customSanitizer((v) => Number(v)),
    deleteUsersVehiclesVehicleIdController,
  );
}
