import { VehicleDatabase } from "../database/vehicle-database";
import { Vehicle } from "../types/vehicle";

type GetUserVehiclesInput =
  | {
      type: "multiple";
      userId: number;
      vehicleId: null;
    }
  | {
      type: "single";
      userId: number;
      vehicleId: number;
    };

type GetUserVehiclesInputOutput<T> = T extends { type: "multiple" }
  ? Vehicle[]
  : Vehicle | null;

export async function getUserVehicles<T extends GetUserVehiclesInput>(
  params: T,
  vehicleDatabase: VehicleDatabase,
): Promise<GetUserVehiclesInputOutput<T>> {
  if (params.type === "multiple" && params.vehicleId === null) {
    const vehicles = await vehicleDatabase.getAll(params.userId);
    return vehicles.map((v) => v.vehicle) as GetUserVehiclesInputOutput<T>;
  } else if (params.type === "single") {
    const found = await vehicleDatabase.getOne(params.userId, params.vehicleId);
    return (found?.vehicle ?? null) as GetUserVehiclesInputOutput<T>;
  }

  throw new TypeError(`Not Supported ${params}`);
}
