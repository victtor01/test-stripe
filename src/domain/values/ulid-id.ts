import { decodeTime, ulid } from 'ulid';
import { BaseId } from './BaseId';

export class UlidId extends BaseId {
  static create(): UlidId {
    return new UlidId(ulid());
  }

  get createdAt(): Date {
    return new Date(decodeTime(this.value));
  }
}
