import {
  CreateVehicleData,
  VehicleDatabase,
} from "../database/vehicle-database";
import { Vehicle } from "../types/vehicle";

type CreateUserVehiclesInput = {
  userId: number;
  vehicle: CreateVehicleData;
};
type CreateUserVehiclesOutput = Promise<Vehicle>;

export async function createUserVehicles(
  params: CreateUserVehiclesInput,
  vehicleDatabase: VehicleDatabase,
): CreateUserVehiclesOutput {
  const created = await vehicleDatabase.create(params.userId, params.vehicle);
  return created.vehicle;
}
