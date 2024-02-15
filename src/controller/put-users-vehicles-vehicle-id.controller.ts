import { RequestHandler } from "express";
import { Vehicle } from "../types/vehicle";
import { EmptyObject } from "../types/utility-types";
import { Tspec } from "tspec";
import { validationResult } from "express-validator";
import { updateUserVehicle } from "../service/update-user-vehicle.service";
import {
  InMemoryVehicle,
  TARGET_NOT_FOUND,
} from "../database/vehicle-database";

export const PUT_USERS_VEHICLES_VEHICLE_ID_CONTROLLER =
  "/users/vehicles/:vehicleId" as const;

type PutUsersVehiclesVehicleIdControllerBody = Omit<Vehicle, "id">;

type PutUsersVehiclesVehicleIdControllerResponse =
  | { id: number }
  | { errorMessage: string };

type PutUsersVehiclesVehicleIdController = RequestHandler<
  {
    vehicleId: number;
  },
  PutUsersVehiclesVehicleIdControllerResponse,
  PutUsersVehiclesVehicleIdControllerBody,
  EmptyObject
>;

export type PutUsersVehiclesVehicleIdControllerApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/users/vehicles/{vehicleId}": {
      put: {
        summary: "update a vehicle preference";
        handler: PutUsersVehiclesVehicleIdController;
      };
    };
  };
}>;

export const putUsersVehiclesVehicleIdController: PutUsersVehiclesVehicleIdController =
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errorMessage: errors.array().at(0)?.msg ?? "BAD INPUT" });
    }

    try {
      const vehicle = await updateUserVehicle(
        {
          userId: res.locals.authenticatedUser.id,
          vehicleId: req.params.vehicleId,
          vehicle: req.body,
        },
        InMemoryVehicle,
      );

      res.status(201).json({ id: vehicle.id });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === TARGET_NOT_FOUND) {
          return res.status(400).json({ errorMessage: TARGET_NOT_FOUND });
        }
      }

      throw error;
    }
  };
