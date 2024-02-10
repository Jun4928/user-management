import {
  InMemoryVehicle,
  TARGET_NOT_FOUND,
  VehicleDatabase,
} from "../../src/database/vehicle-database";
import { deleteUserVehicles } from "../../src/service/delete-user-vehicles.service";

describe(`SERVICE: delete-user-vehicles test`, () => {
  let vehicleDatabase: VehicleDatabase;

  beforeAll(async () => {
    vehicleDatabase = new InMemoryVehicle();

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

  test(`delete successfully`, async () => {
    const input = {
      userId: 1,
      vehicleId: 1,
    };

    await deleteUserVehicles(
      {
        userId: input.userId,
        vehicleId: input.vehicleId,
      },
      vehicleDatabase,
    );

    expect(
      await vehicleDatabase.getOne(input.userId, input.vehicleId),
    ).toBeNull();
  });

  test(`when there is no target, throw NOT FOUND ERROR`, async () => {
    const input = {
      userId: 2,
      vehicleId: 4,
    };

    try {
      await deleteUserVehicles(
        {
          userId: input.userId,
          vehicleId: input.vehicleId,
        },
        vehicleDatabase,
      );
    } catch (error) {
      expect(error).toStrictEqual(Error(TARGET_NOT_FOUND));
    }
  });
});
