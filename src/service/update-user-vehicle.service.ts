import {
  TARGET_NOT_FOUND,
  UpdateVehicleData,
  VehicleDatabase,
} from "../database/vehicle-database";
import { Vehicle } from "../types/vehicle";

type UpdateUserVehicleInput = {
  userId: number;
  vehicleId: number;
  vehicle: UpdateVehicleData;
};

type UpdateUserVehicleOutput = Promise<Vehicle>;

export async function updateUserVehicle(
  params: UpdateUserVehicleInput,
  vehicleDatabase: VehicleDatabase,
): UpdateUserVehicleOutput {
  const updated = await vehicleDatabase.updateOne(
    params.userId,
    params.vehicleId,
    params.vehicle,
  );

  if ("succeed" in updated) {
    if (!updated.succeed && updated.reason === TARGET_NOT_FOUND) {
      throw new Error(TARGET_NOT_FOUND);
    }

    throw new Error(`INTERNAL SERVER ERROR`);
  }

  return updated.vehicle;
}
