import {
  InMemoryVehicleImpl,
  TARGET_NOT_FOUND,
  VehicleDatabase,
} from "../../src/database/vehicle-database";
import { updateUserVehicle } from "../../src/service/update-user-vehicle.service";

describe(`SERVICE: update-user-vehicles test`, () => {
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

  test(`update successfully`, async () => {
    const input = {
      userId: 1,
      vehicleId: 1,
      vehicle: {
        brand: "Volkswagen",
        model: "beautiful",
        year: 2022,
      },
    };

    const result = await updateUserVehicle(
      {
        userId: input.userId,
        vehicleId: input.vehicleId,
        vehicle: input.vehicle,
      },
      vehicleDatabase,
    );

    expect(result.id).toBe(input.vehicleId);
    expect(result.brand).toBe(input.vehicle.brand);
    expect(result.model).toBe(input.vehicle.model);
    expect(result.year).toBe(input.vehicle.year);
  });

  test(`when there is no target, throw NOT FOUND ERROR`, async () => {
    const input = {
      userId: 2,
      vehicleId: 4,
      vehicle: {
        brand: "Volkswagen",
        model: "beautiful",
        year: 2022,
      },
    };

    try {
      await updateUserVehicle(
        {
          userId: input.userId,
          vehicleId: input.vehicleId,
          vehicle: input.vehicle,
        },
        vehicleDatabase,
      );
    } catch (error) {
      expect(error).toStrictEqual(Error(TARGET_NOT_FOUND));
    }
  });
});
