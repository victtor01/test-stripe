import "reflect-metadata";

import express from "express";

import { AuthController } from "./api/controllers/auth.controller";
import { AuthInstructorUseCase } from "./application/usecases/auth/auth-instructor/auth-instructor.usecase";
import { container } from "./infra/di/container";
import { createRouter } from "./infra/loader/loader";

const app = express();

const PORT = process.env.PORT || 8080;

const routers = createRouter([AuthController]);

container.resolve(AuthInstructorUseCase);

console.log(
  "PARAM TYPES:",
  Reflect.getMetadata("design:paramtypes", AuthController)
);


app.use("/api", routers);

app.listen(PORT, () => {
  console.log("server running");
});
