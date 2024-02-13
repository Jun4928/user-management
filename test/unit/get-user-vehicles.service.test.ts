import {
  InMemoryVehicleImpl,
  VehicleDatabase,
} from "../../src/database/vehicle-database";
import { getUserVehicles } from "../../src/service/get-user-vehicles.service";
import { Vehicle } from "../../src/types/vehicle";

describe(`SERVICE: get-user-vehicles test`, () => {
  let vehicleDatabase: VehicleDatabase;

  beforeAll(async () => {
    vehicleDatabase = new InMemoryVehicleImpl();

    const input = [
      {
        userId: 1,
        vehicle: {
          brand: "Volkswagen",
          model: "Tiguan",
          year: 2024,
        },
      },
      {
        userId: 1,
        vehicle: {
          brand: "BMW",
          model: "Fancy",
          year: 2023,
        },
      },
      {
        userId: 2,
        vehicle: {
          brand: "Kia",
          model: "Also Fancy",
          year: 2000,
        },
      },
    ];

    await Promise.all(
      input.map((i) => vehicleDatabase.create(i.userId, i.vehicle)),
    );
  });

  test(`find userId: 1, all items`, async () => {
    const input = {
      userId: 1,
    };

    const result = await getUserVehicles(
      { userId: input.userId, vehicleId: null },
      vehicleDatabase,
    );

    expect(result).not.toBeNull();
    expect((result as Vehicle[]).length).toBe(2);
    expect((result as Vehicle[]).at(0)?.id).toBe(1);
  });

  test(`find an item`, async () => {
    const input = {
      userId: 2,
      vehicleId: 3,
    };

    const result = await getUserVehicles(
      { userId: input.userId, vehicleId: input.vehicleId },
      vehicleDatabase,
    );

    expect(result).not.toBeNull();
    expect((result as Vehicle).id).toBe(input.vehicleId);
  });

  test(`when not found, return empty array`, async () => {
    const input = {
      userId: 3,
    };

    const result = await getUserVehicles(
      { userId: input.userId, vehicleId: null },
      vehicleDatabase,
    );

    expect((result as Vehicle[]).length).toBe(0);
  });

  test(`when not found, return null`, async () => {
    const input = {
      userId: 2,
      vehicleId: 5,
    };

    const result = await getUserVehicles(
      { userId: input.userId, vehicleId: input.vehicleId },
      vehicleDatabase,
    );

    expect(result).toBeNull();
  });
});
