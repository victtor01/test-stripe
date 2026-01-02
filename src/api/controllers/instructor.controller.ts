import { CreateInstructorUseCase } from '@/application/usecases/instructor/create-instructor/create-instructor.usecase';
import { GetBalanceOfInstructorUseCase } from '@/application/usecases/instructor/get-balance/get-balance.usecase';
import { RefundPaymentUseCase } from '@/application/usecases/payment/refund-payment/refund-payment.usecase';
import { UserRole } from '@/domain/enums/UserRole';
import { Controller, Get, Post } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { Roles } from '@/infra/decorators/role.decorator';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { createUserSchema } from '../schemas/users/create-instructor.schema';

@Controller('/instructors')
export class InstructorController {
  constructor(
    private readonly createInstructor: CreateInstructorUseCase,
    private readonly getBalanceUseCase: GetBalanceOfInstructorUseCase,
    private readonly refundUseCase: RefundPaymentUseCase,
  ) {}

  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const schema = createUserSchema.parse(req.body);
    const created = await this.createInstructor.execute(schema);

    res.json(created);
  }

  @Get('balance')
  @Use(AuthMiddleware)
  @Roles(UserRole.INSTRUCTOR)
  async getBalance(req: Request, res: Response): Promise<void> {
    const balance = await this.getBalanceUseCase.execute(req.user?.id!);

    res.json(balance);
  }

  @Post('refund')
  @Use(AuthMiddleware)
  @Roles(UserRole.INSTRUCTOR)
  async refund(req: Request, res: Response) {
    const userId = req.user?.id!;

    const result = await this.refundUseCase.execute({
      instructorUserId: userId,
    });

    return {
      message: 'Solicitação de saque processada.',
      details: {
        processed_count: result.processedCount,
        total_transferred: result.totalAmountTransferred,
        remaining_balance: result.remainingBalance,
        failures: result.errors,
      },
    };
  }
}
