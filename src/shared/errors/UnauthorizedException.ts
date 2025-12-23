import { AppException } from "./AppException";

export class UnauthorizedException extends AppException {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";

  constructor(message = "Unauthorized") {
    super(message);
  }
}