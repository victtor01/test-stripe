export abstract class BaseId {
  constructor(protected readonly value: string) {}

  toString(): string {
    return this.value;
  }

  equals(other: BaseId): boolean {
    return this.value === other.toString();
  }
}