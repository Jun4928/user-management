import { VehicleDatabase } from "../database/vehicle-database";
import { Vehicle } from "../types/vehicle";

type GetUserVehiclesInput = {
  userId: number;
  vehicleId: number | null; // when null retrieve all
};

type GetUserVehiclesInputOutput = Promise<Vehicle[] | Vehicle | null>;

export async function getUserVehicles(
  params: GetUserVehiclesInput,
  vehicleDatabase: VehicleDatabase,
): GetUserVehiclesInputOutput {
  if (params.vehicleId === null) {
    const vehicles = await vehicleDatabase.getAll(params.userId);
    return vehicles.map((v) => v.vehicle);
  }

  const found = await vehicleDatabase.getOne(params.userId, params.vehicleId);
  return found?.vehicle ?? null;
}
