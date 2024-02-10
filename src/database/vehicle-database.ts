import { Vehicle } from "../types/vehicle";

export type UserVehicle = {
  userId: number;
  vehicle: Vehicle;
};

export type CreateVehicleData = Omit<Vehicle, "id">;

export type UpdateVehicleData = Omit<Vehicle, "id">;

export const TARGET_NOT_FOUND = "TARGET_NOT_FOUND" as const;

type Result = {
  succeed: boolean;
  reason: typeof TARGET_NOT_FOUND | null;
};

export interface VehicleDatabase {
  getAll(userId: number): Promise<UserVehicle[]>;

  getOne(userId: number, vehicleId: number): Promise<UserVehicle | null>;

  create(userId: number, vehicle: CreateVehicleData): Promise<UserVehicle>;

  updateOne(
    userId: number,
    vehicleId: number,
    vehicle: UpdateVehicleData,
  ): Promise<UserVehicle | Result>;

  deleteOne(userId: number, vehicleId: number): Promise<Result>;
}

export class InMemoryVehicle implements VehicleDatabase {
  private vehicles: UserVehicle[] = [];

  constructor() {}

  async getAll(userId: number): Promise<UserVehicle[]> {
    return this.vehicles.filter((v) => v.userId === userId);
  }

  async getOne(userId: number, vehicleId: number): Promise<UserVehicle | null> {
    return (
      this.vehicles.find(
        (v) => v.userId === userId && v.vehicle.id === vehicleId,
      ) ?? null
    );
  }

  async create(
    userId: number,
    vehicle: CreateVehicleData,
  ): Promise<UserVehicle> {
    const data = {
      userId,
      vehicle: {
        id: this.vehicles.length + 1,
        ...vehicle,
      },
    };

    this.vehicles.push(data);
    return data;
  }

  async updateOne(
    userId: number,
    vehicleId: number,
    vehicle: UpdateVehicleData,
  ): Promise<UserVehicle | Result> {
    const found = this.findTarget(userId, vehicleId);
    if (found == -1) {
      return {
        succeed: false,
        reason: TARGET_NOT_FOUND,
      };
    }

    const oldOne = this.vehicles.at(found)!;
    const newOne = {
      userId: oldOne.userId,
      vehicle: {
        id: oldOne.vehicle.id,
        ...vehicle,
      },
    };

    this.vehicles = this.vehicles.map((v, idx) => (idx !== found ? v : newOne));
    return newOne;
  }

  async deleteOne(userId: number, vehicleId: number): Promise<Result> {
    const found = this.findTarget(userId, vehicleId);
    if (found == -1) {
      return {
        succeed: false,
        reason: TARGET_NOT_FOUND,
      };
    }

    this.vehicles = this.vehicles.filter((_, idx) => idx !== found);
    return {
      succeed: true,
      reason: null,
    };
  }

  private findTarget(userId: number, vehicleId: number): number {
    return this.vehicles.findIndex(
      (v) => v.userId === userId && v.vehicle.id === vehicleId,
    );
  }
}

export const vehicleDatabase = new InMemoryVehicle();
