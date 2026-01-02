import { CreateLinkIntentUseCase } from '@/application/usecases/payment/create-link-intent/create-link-intent.usecase';
import { CreatePixIntentUseCase } from '@/application/usecases/payment/create-pix-intent/create-pix-intent.usecase';
import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Post } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Controller('/payments')
@Use(AuthMiddleware)
@Roles(UserRole.STUDENT)
export class PaymentsController {
  constructor(
    private readonly createPixIntent: CreatePixIntentUseCase,
    private readonly createLinkIntent: CreateLinkIntentUseCase,
  ) {}

  @Post('pix')
  async create(req: Request, res: Response) {
    const { id: studentId } = req.user!;

    if (!req.body.lessonId) {
      throw new BadRequestException('LessonId not found!');
    }

    const { lessonId } = req.body;

    const created = await this.createPixIntent.execute({ studentId, lessonId });

    res.json(created);
  }

  @Post('link')
  async createLink(req: Request, res: Response) {
    const { id: studentId } = req.user!;

    if (!req.body.lessonId) {
      throw new BadRequestException('LessonId not found!');
    }

    const { lessonId } = req.body;

    const created = await this.createLinkIntent.execute({ studentId, lessonId });

    res.json(created);
  }
}
