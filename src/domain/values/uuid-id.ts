import { BaseId } from "./BaseId";

export class UuidId extends BaseId {
  static create(): UuidId {
    return new UuidId(crypto.randomUUID());
  }
}