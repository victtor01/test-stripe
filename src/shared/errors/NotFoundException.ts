import { AppException } from "./AppException";

export class NotFoundException extends AppException {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";

  constructor(message = "Resource not found") {
    super(message);
  }
}