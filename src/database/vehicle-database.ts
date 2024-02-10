import { Vehicle } from "../types/vehicle";

type UserVehicle = {
  userId: number;
  vehicle: {
    id: number;
  } & Vehicle;
};

type Result = {
  succeed: boolean;
  reason: string | null;
};

export interface VehicleDatabase {
  getAll(userId: number): Promise<UserVehicle[]>;

  getOne(userId: number, vehicleId: number): Promise<UserVehicle | null>;

  create(userId: number, vehicle: Vehicle): Promise<UserVehicle>;

  updateOne(
    userId: number,
    vehicleId: number,
    vehicle: Vehicle,
  ): Promise<UserVehicle | Result>;

  deleteOne(userId: number, vehicleId: number): Promise<Result>;
}

class InMemory implements VehicleDatabase {
  private vehicles: UserVehicle[];
  private TARGET_NOT_FOUND = `TARGET_NOT_FOUND`;

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
    vehicle: Omit<Vehicle, "id">,
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
    vehicle: Omit<Vehicle, "id">,
  ): Promise<UserVehicle | Result> {
    const found = this.findTarget(userId, vehicleId);
    if (found == -1) {
      return {
        succeed: false,
        reason: this.TARGET_NOT_FOUND,
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
        reason: this.TARGET_NOT_FOUND,
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

export const vehicleDatabase = new InMemory();
