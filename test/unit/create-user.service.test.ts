import {
  UserDatabase,
  InMemoryUserImpl,
  USER_DUPLICATED,
} from "../../src/database/user-database";
import { createUser } from "../../src/service/create-user.service";

describe(`SERVICE: create-user test`, () => {
  let userDatabase: UserDatabase;

  beforeEach(() => {
    userDatabase = new InMemoryUserImpl();
  });

  test(`create an item, returns user`, async () => {
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
