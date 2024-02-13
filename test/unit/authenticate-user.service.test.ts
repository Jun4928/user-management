import {
  UserDatabase,
  InMemoryUserImpl,
} from "../../src/database/user-database";
import { createUser } from "../../src/service/create-user.service";
import { authenticateUser } from "../../src/service/authenticate-user.service";

describe(`SERVICE: create-user test`, () => {
  let userDatabase: UserDatabase;

  beforeEach(() => {
    userDatabase = new InMemoryUserImpl();
  });

  test(`create an item, successfully authenticate the user`, async () => {
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

    const authenticated = await authenticateUser(
      {
        name: input.name,
        password: input.password,
      },
      userDatabase,
    );

    expect(authenticated.id).toBe(1);
  });

  test(`create an item, not found the user`, async () => {
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
      await authenticateUser(
        {
          name: "wrong one",
          password: input.password,
        },
        userDatabase,
      );
    } catch (error) {
      expect(error).toStrictEqual(Error(`NOT FOUND ERROR`));
    }
  });

  test(`create an item, wrong password`, async () => {
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
      await authenticateUser(
        {
          name: input.name,
          password: "wrong password",
        },
        userDatabase,
      );
    } catch (error) {
      expect(error).toStrictEqual(Error(`WRONG PASSWORD`));
    }
  });
});
