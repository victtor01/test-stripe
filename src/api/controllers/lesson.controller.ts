import { CreateLessonUseCase } from '@/application/usecases/lesson/create-lesson/create-lesson.usecase';
import { FindLessonsByStudentUseCase } from '@/application/usecases/lesson/find-by-student/find-lessons-by-student.usecase';
import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Get, Post } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { createLessonSchema } from '../schemas/lessons/create-lesson.schema';

@Use(AuthMiddleware)
@Roles(UserRole.STUDENT)
@Controller('/lessons')
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly findAllByStudentUseCase: FindLessonsByStudentUseCase,
  ) {}

  @Post()
  async createLesson(req: Request, res: Response) {
    const studentId = req.user?.id!;

    const schema = createLessonSchema.parse({ ...req.body, studentId });

    const response = await this.createLessonUseCase.execute(schema);

    res.json(response);
  }

  @Get()
  async findAll(req: Request, res: Response) {
    const studentId = req.user?.id!;

    const lessons = await this.findAllByStudentUseCase.execute(studentId);

    res.json(lessons);
  }
}
