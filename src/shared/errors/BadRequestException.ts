import { AppException } from "./AppException";

export class BadRequestException extends AppException {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";

  constructor(message = "Bad request") {
    super(message);
  }
}
