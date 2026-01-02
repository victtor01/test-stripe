import { CompleteLessonUseCase } from '@/application/usecases/lesson/complete-lesson/complete-lesson.usecase';
import { CreateLessonUseCase } from '@/application/usecases/lesson/create-lesson/create-lesson.usecase';
import { FindLessonsByStudentUseCase } from '@/application/usecases/lesson/find-by-student/find-lessons-by-student.usecase';
import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Get, Post, Put } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { createLessonSchema } from '../schemas/lessons/create-lesson.schema';
import { isNilOrEmptyObject } from '../utils/is-null-or-empty';

@Use(AuthMiddleware)
@Roles(UserRole.STUDENT)
@Controller('/lessons')
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly findAllByStudentUseCase: FindLessonsByStudentUseCase,
    private readonly completeLessonUseCase: CompleteLessonUseCase,
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

  @Put('/complete/:lessonId')
  async complete(req: Request, res: Response) {
    const lessonId = req.params.lessonId;

    if (isNilOrEmptyObject(lessonId)) {
      throw new BadRequestException('LessonId faltando!');
    }

    console.log(lessonId);

    const completed = this.completeLessonUseCase.execute({ lessonId });

    res.json(completed);
  }
}
