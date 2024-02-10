import {
  TARGET_NOT_FOUND,
  VehicleDatabase,
} from "../database/vehicle-database";

type DeleteUserVehiclesInput = {
  userId: number;
  vehicleId: number;
};

type DeleteUserVehiclesOutput = Promise<void>;

export async function deleteUserVehicles(
  params: DeleteUserVehiclesInput,
  vehicleDatabase: VehicleDatabase,
): DeleteUserVehiclesOutput {
  const deleted = await vehicleDatabase.deleteOne(
    params.userId,
    params.vehicleId,
  );

  if (!deleted.succeed) {
    if (deleted.reason === TARGET_NOT_FOUND) {
      throw new Error(TARGET_NOT_FOUND);
    }

    throw new Error(`INTERNAL SERVER ERROR`);
  }
}
