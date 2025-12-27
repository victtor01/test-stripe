import { HashService } from "@/application/ports/in/hash.service";
import * as argon2 from "argon2";

export class Argon2HashService implements HashService {
  async hash(payload: string): Promise<string> {
    return await argon2.hash(payload);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return await argon2.verify(hashed, payload);
  }
}