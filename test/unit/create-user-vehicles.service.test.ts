import {
  InMemoryVehicle,
  VehicleDatabase,
} from "../../src/database/vehicle-database";
import { createUserVehicles } from "../../src/service/create-user-vehicles.service";

describe(`SERVICE: create-user-vehicles test`, () => {
  let vehicleDatabase: VehicleDatabase;

  beforeAll(() => {
    vehicleDatabase = new InMemoryVehicle();
  });

  beforeEach(async () => {
    await vehicleDatabase.clear();
  });

  test(`create an item, returns vehicle`, async () => {
    const input = {
      userId: 1,
      vehicle: {
        brand: "Volkswagen",
        model: "Tiguan",
        year: 2024,
      },
    };

    const result = await createUserVehicles(
      {
        userId: input.userId,
        vehicle: input.vehicle,
      },
      vehicleDatabase,
    );

    expect(result.id).toBe(1);
    expect(result.model).toBe(input.vehicle.model);
  });
});
