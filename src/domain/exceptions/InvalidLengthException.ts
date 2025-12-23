import { DomainException } from "@/shared/errors/DomainException";

export class InvalidLengthException extends DomainException {
  readonly code = "INVALID_LENGTH";

  constructor(field: string, min?: number, max?: number) {
    super(
      `Field '${field}' must have` +
        `${min ? ` at least ${min}` : ""}` +
        `${max ? ` at most ${max}` : ""} characters`
    );
  }
}