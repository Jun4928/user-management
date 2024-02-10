import {
  CreateVehicleData,
  UserVehicle,
  VehicleDatabase,
} from "../database/vehicle-database";

type CreateUserVehiclesInput = {
  userId: number;
  vehicle: CreateVehicleData;
};
type CreateUserVehiclesOutput = Promise<UserVehicle>;

export async function createUserVehicles(
  params: CreateUserVehiclesInput,
  vehicleDatabase: VehicleDatabase,
): Promise<CreateUserVehiclesOutput> {
  const created = await vehicleDatabase.create(params.userId, params.vehicle);
  return created;
}
