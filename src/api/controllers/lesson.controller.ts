import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Post } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Use(AuthMiddleware)
@Roles(UserRole.STUDENT)
@Controller('/lessons')
export class LessonController {
  @Post()
  public async createLesson(_: Request, res: Response): Promise<void> {
    res.json({ message: 'Lesson created successfully' });
  }
}
