import { ConnectStripeUseCase } from '@/application/usecases/stripe/connect-stripe/connect-stripe.usecase';
import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Get } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Controller("/gateway")
@Use(AuthMiddleware)
@Roles(UserRole.INSTRUCTOR)
export class GatewayController {
  constructor(private readonly connectStripeUseCase: ConnectStripeUseCase) {}

  @Get('/stripe/connect')
  async connect(req: Request, res: Response) {
    const userId = req.user!.id;
    const result = await this.connectStripeUseCase.execute({ userId });
    res.json(result);
  }
}
