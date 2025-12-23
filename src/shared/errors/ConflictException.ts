import { AppException } from "./AppException";

export class ConflictException extends AppException {
  readonly statusCode = 409;
  readonly code = "CONFLICT";

  constructor(message = "Conflict") {
    super(message);
  }
}
