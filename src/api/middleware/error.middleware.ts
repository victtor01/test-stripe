// presentation/http/middlewares/errorHandler.ts
import { AppException } from "@/shared/errors/AppException";
import { DomainException } from "@/shared/errors/DomainException";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};

    if (err instanceof DomainException) {
      return res.status(400).json({
        code: err.code,
        message: err.message,
      });
    }

    for (const issue of err.issues) {
      const path = issue.path.join(".");
      if (!fields[path]) {
        fields[path] = issue.message;
      }
    }

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid request data",
      fields,
    });
  }

  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  console.error("[UNHANDLED ERROR]", err);

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
