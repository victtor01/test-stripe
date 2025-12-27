import "reflect-metadata";

import express from "express";

import cors from "cors";
import { AuthController } from "./api/controllers/auth.controller";
import { InstructorController } from "./api/controllers/instructor.controller";
import { errorMiddleware } from "./api/middleware/error.middleware";
import { HashService } from "./application/ports/in/hash.service";
import { TokenService } from "./application/ports/in/token.service";
import { UsersRepository } from "./application/ports/out/users.repository";
import { AuthInstructorUseCase } from "./application/usecases/authenticate/auth-instructor/auth-instructor.usecase";
import { CreateInstructorUseCase } from "./application/usecases/instructor/create-instructor/create-instructor.usecase";
import { CreateStudentUseCase } from "./application/usecases/students/create-student/create-student.usecase";
import { Argon2HashService } from "./infra/database/in/services/argon-hash.service";
import { JoseTokenService } from "./infra/database/in/services/jose-token.service";
import { AppDataSource } from "./infra/database/out/context/database-context";
import { TypeormUserRepository } from "./infra/database/out/repositories/users/typeorm-users.repository";
import { container } from "./infra/di/container";
import { createRouter } from "./infra/loader/loader";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 8080;

container.register(UsersRepository, TypeormUserRepository);
container.register(HashService, Argon2HashService);
container.register(TokenService, JoseTokenService);

const controllers = [AuthController, InstructorController];

const routers = createRouter(controllers);

container.resolve(AuthInstructorUseCase);
container.resolve(CreateInstructorUseCase);
container.resolve(CreateStudentUseCase);

app.use("/api", routers);
app.use(errorMiddleware);

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("📦 SQLite conectado");
}

bootstrap();

app.listen(PORT, () => {
  console.log("server running");
});
