import {
  UserDatabase,
  InMemoryUser,
  USER_DUPLICATED,
} from "../../src/database/user-database";
import { createUser } from "../../src/service/create-user.service";
import bcrypt from "bcrypt";

describe(`SERVICE: create-user test`, () => {
  let userDatabase: UserDatabase;

  beforeEach(() => {
    userDatabase = new InMemoryUser();
  });

  test(`create an item, returns vehicle`, async () => {
    const input = {
      name: "awesome",
      password: "cool",
    };

    const result = await createUser(
      {
        name: input.name,
        password: input.password,
      },
      userDatabase,
    );

    expect(result.id).toBe(1);
    expect(result.name).toBe(input.name);
    expect(bcrypt.compareSync(input.password, result.password)).toBe(true);
  });

  test(`when duplicated, throw USER_DUPLICATED`, async () => {
    const input = {
      name: "awesome",
      password: "cool",
    };

    const result = await createUser(
      {
        name: input.name,
        password: input.password,
      },
      userDatabase,
    );

    expect(result.id).toBe(1);

    try {
      await createUser(
        {
          name: input.name,
          password: input.password,
        },
        userDatabase,
      );
    } catch (error) {
      expect(error).toStrictEqual(Error(USER_DUPLICATED));
    }
  });
});
