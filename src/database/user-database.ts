import { User } from "../types/user";

export type CreateUserData = Omit<User, "id">;

export const USER_DUPLICATED = "USER_DUPLICATED" as const;

type Result = {
  succeed: boolean;
  reason: typeof USER_DUPLICATED | null;
};

export interface UserDatabase {
  create(user: CreateUserData): Promise<User | Result>;

  getOne(name: string): Promise<User | null>;
}

export class InMemoryUser implements UserDatabase {
  private users: User[] = [];

  constructor() {}

  async create(user: CreateUserData): Promise<User | Result> {
    const data = {
      id: this.users.length + 1,
      ...user,
    };

    if (this.userDuplicated(user.name)) {
      return {
        succeed: false,
        reason: USER_DUPLICATED,
      };
    }

    this.users.push(data);
    return data;
  }

  async getOne(name: string): Promise<User | null> {
    return this.users.find((u) => u.name === name) ?? null;
  }

  private userDuplicated(name: string): boolean {
    const found = this.users.findIndex((u) => u.name === name);
    return found === -1 ? false : true;
  }
}
