import { InMemory, VehicleDatabase } from "../../src/database/vehicle-database";

describe(`SERVICE: create-user-vehicles test`, () => {
  let vehicleDatabase: VehicleDatabase;

  beforeAll(() => {
    vehicleDatabase = new InMemory();
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

    const result = await vehicleDatabase.create(input.userId, input.vehicle);

    expect(result.userId).toBe(input.userId);
    expect(result.vehicle.id).toBe(1);
    expect(result.vehicle.model).toBe(input.vehicle.model);
  });
});
