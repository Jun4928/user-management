import { RequestHandler } from "express";
import { Vehicle } from "../types/vehicle";
import { getUserVehicles } from "../service/get-user-vehicles.service";
import { InMemoryVehicle } from "../database/vehicle-database";
import { Tspec } from "tspec";
import { EmptyObject } from "../types/utility-types";

export const GET_USERS_VEHICLES_CONTROLLER = "/users/vehicles" as const;

type GetUsersVehiclesControllerResponse = Vehicle[] | { errorMessage: string };

type GetUsersVehiclesController = RequestHandler<
  EmptyObject,
  GetUsersVehiclesControllerResponse
>;

export type GetUsersVehiclesControllerApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/users/vehicles": {
      get: {
        summary: "get user's vehicles";
        handler: GetUsersVehiclesController;
      };
    };
  };
}>;

export const getUsersVehiclesController: GetUsersVehiclesController =
  async function (req, res) {
    if (res.locals.authenticatedUser == null) {
      return res.status(401).json({ errorMessage: "Not Authenticated" });
    }

    const vehicles = await getUserVehicles(
      {
        type: "multiple",
        userId: res.locals.authenticatedUser.id,
        vehicleId: null,
      },
      InMemoryVehicle,
    );

    res.json(vehicles);
  };
