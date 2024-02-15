import { RequestHandler } from "express";
import { Tspec } from "tspec";
import { validationResult } from "express-validator";
import {
  InMemoryVehicle,
  TARGET_NOT_FOUND,
} from "../database/vehicle-database";
import { deleteUserVehicles } from "../service/delete-user-vehicles.service";

export const DELETE_USERS_VEHICLES_VEHICLE_ID_CONTROLLER =
  "/users/vehicles/:vehicleId" as const;

type DeleteUsersVehiclesVehicleIdControllerResponse =
  | { id: number }
  | { errorMessage: string };

type DeleteUsersVehiclesVehicleIdController = RequestHandler<
  {
    vehicleId: number;
  },
  DeleteUsersVehiclesVehicleIdControllerResponse
>;

export type DeleteUsersVehiclesVehicleIdControllerApiSpec =
  Tspec.DefineApiSpec<{
    security: "jwt";
    paths: {
      "/users/vehicles/{vehicleId}": {
        delete: {
          summary: "delete a vehicle preference";
          handler: DeleteUsersVehiclesVehicleIdController;
        };
      };
    };
  }>;

export const deleteUsersVehiclesVehicleIdController: DeleteUsersVehiclesVehicleIdController =
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errorMessage: errors.array().at(0)?.msg ?? "BAD INPUT" });
    }

    try {
      await deleteUserVehicles(
        {
          userId: res.locals.authenticatedUser.id,
          vehicleId: req.params.vehicleId,
        },
        InMemoryVehicle,
      );

      res.status(201).json({ id: req.params.vehicleId });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === TARGET_NOT_FOUND) {
          return res.status(400).json({ errorMessage: TARGET_NOT_FOUND });
        }
      }

      throw error;
    }
  };
