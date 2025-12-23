import { CreateInstructorUseCase } from "@/application/usecases/instructor/create-instructor/create-instructor.usecase";
import { Controller, Post } from "@/infra/decorators/controller.decorator";
import { Request, Response } from "express";
import { createInstructorSchema } from "../schemas/users/create-instructor.schema";

@Controller("/instructors")
export class InstructorController {
  constructor(private readonly createInstructor: CreateInstructorUseCase) {}

  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const schema = createInstructorSchema.parse(req.body);
    const created = await this.createInstructor.execute(schema);

    res.json(created);
  }
}
