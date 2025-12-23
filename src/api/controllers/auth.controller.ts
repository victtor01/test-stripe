import { AuthInstructorUseCase } from "@/application/usecases/authenticate/auth-instructor/auth-instructor.usecase";
import { Controller, Get } from "@/infra/decorators/controller.decorator";
import { Use } from "@/infra/decorators/middleware.decorator";
import type { Request, Response } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authInstructor: AuthInstructorUseCase) {}

  @Get()
  public async index(req: Request, res: Response): Promise<void> {
    const response = await this.authInstructor.execute();
    res.json(response);
  }

  @Get("/test")
  @Use(AuthMiddleware)
  public test(req: Request, res: Response) {
    res.json({ message: "autenticado" });
  }
}
