import "reflect-metadata";

import express from "express";

import cors from "cors";
import { AuthController } from "./api/controllers/auth.controller";
import { InstructorController } from "./api/controllers/instructor.controller";
import { errorMiddleware } from "./api/middleware/error.middleware";
import { AuthInstructorUseCase } from "./application/usecases/authenticate/auth-instructor/auth-instructor.usecase";
import { container } from "./infra/di/container";
import { createRouter } from "./infra/loader/loader";

const app = express();

app.use(express.json()); // Permite ler JSON no body
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 8080;

const controllers = [AuthController, InstructorController];

const routers = createRouter(controllers);

container.resolve(AuthInstructorUseCase);

app.use("/api", routers);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("server running");
});
