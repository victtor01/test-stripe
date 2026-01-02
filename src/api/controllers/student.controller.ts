import { CreateStudentUseCase } from "@/application/usecases/students/create-student/create-student.usecase";
import { Controller, Post } from "@/infra/decorators/controller.decorator";
import { Request, Response } from "express";
import { createUserSchema } from "../schemas/users/create-instructor.schema";

@Controller("/students")
export class StudentController {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const schema = createUserSchema.parse(req.body);
		
    const created = await this.createStudentUseCase.execute(schema);

    res.json(created);
  }
}
