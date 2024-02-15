import { RequestHandler } from "express";
import { Vehicle } from "../types/vehicle";
import { EmptyObject } from "../types/utility-types";
import { Tspec } from "tspec";
import { validationResult } from "express-validator";
import { createUserVehicles } from "../service/create-user-vehicles.service";
import { InMemoryVehicle } from "../database/vehicle-database";

export const POST_USERS_VEHICLES = "/users/vehicles" as const;

type PostUsersVehiclesControllerBody = Omit<Vehicle, "id">;

type PostUsersVehiclesControllerResponse =
  | { id: number }
  | { errorMessage: string };

type PostUsersVehiclesController = RequestHandler<
  EmptyObject,
  PostUsersVehiclesControllerResponse,
  PostUsersVehiclesControllerBody,
  EmptyObject
>;

export type PostUsersVehiclesControllerApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/users/vehicles": {
      post: {
        summary: "create a vehicle preference";
        handler: PostUsersVehiclesController;
      };
    };
  };
}>;

export const postUsersVehiclesController: PostUsersVehiclesController =
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errorMessage: errors.array().at(0)?.msg ?? "BAD INPUT" });
    }

    const vehicle = await createUserVehicles(
      {
        userId: res.locals.authenticatedUser.id,
        vehicle: req.body,
      },
      InMemoryVehicle,
    );

    res.status(201).json({ id: vehicle.id });
  };
