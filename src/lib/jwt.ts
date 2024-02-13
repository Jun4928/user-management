import { JWT_SECRET_KEY } from "../constant";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserJWTPayload extends JwtPayload {
  id: number;
  name: string;
}

export interface JWT {
  sign(payload: UserJWTPayload): string;

  verify(token: string): UserJWTPayload;
}

class JWTImpl implements JWT {
  private readonly instance = jwt;
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  sign(payload: UserJWTPayload): string {
    return this.instance.sign(payload, this.secretKey);
  }

  verify(token: string): UserJWTPayload {
    const result = this.instance.verify(token, this.secretKey) as
      | UserJWTPayload
      | string;
    if (typeof result === "string") {
      throw TypeError("should be object");
    }

    return result;
  }
}

export const jwtImpl = new JWTImpl(JWT_SECRET_KEY);
