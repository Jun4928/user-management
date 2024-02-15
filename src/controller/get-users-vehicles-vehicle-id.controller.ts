import { RequestHandler } from "express";
import { Vehicle } from "../types/vehicle";
import { getUserVehicles } from "../service/get-user-vehicles.service";
import { InMemoryVehicle } from "../database/vehicle-database";
import { Tspec } from "tspec";

export const GET_USERS_VEHICLES_VEHICLE_ID_CONTROLLER =
  "/users/vehicles/:vehicleId" as const;

type GetUsersVehiclesVehicleIdControllerResponse =
  | Vehicle
  | { errorMessage: string };

type GetUsersVehiclesVehicleIdController = RequestHandler<
  { vehicleId: number },
  GetUsersVehiclesVehicleIdControllerResponse
>;

export type GetUsersVehiclesVehicleIdControllerApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/users/vehicles/{vehicleId}": {
      get: {
        summary: "get user's specific vehicle";
        handler: GetUsersVehiclesVehicleIdController;
      };
    };
  };
}>;

export const getUsersVehiclesVehicleIdController: GetUsersVehiclesVehicleIdController =
  async function (req, res) {
    const vehicle = await getUserVehicles(
      {
        type: "single",
        userId: res.locals.authenticatedUser.id,
        vehicleId: req.params.vehicleId,
      },
      InMemoryVehicle,
    );

    if (vehicle == null) {
      return res.status(400).json({ errorMessage: "Vehicle Not Found" });
    }

    res.json(vehicle);
  };
