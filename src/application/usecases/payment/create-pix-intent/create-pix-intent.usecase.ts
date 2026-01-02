import { CreatePaymentLessonPixDTO } from '@/application/dtos/create-payment-pix.dto';
import { PixPaymentResponseDTO } from '@/application/dtos/pix-payment-response.dto';
import { PaymentService } from '@/application/ports/in/payment.service';
import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { CreatePixIntentCommand } from './create-pix-intent.command';

@Injectable()
export class CreatePixIntentUseCase {
  constructor(
    private readonly gatewayService: PaymentService,
    private readonly lessonRepository: LessonRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: CreatePixIntentCommand): Promise<PixPaymentResponseDTO> {
    const [lesson, student] = await Promise.all([
      this.lessonRepository.findById(data.lessonId),
      this.usersRepository.findById(data.studentId),
    ]);

    if (!lesson || !student) {
      throw new BadRequestException('Aula não existe ou estudante não encontrado!!');
    }

    if (!student.isStudent()) {
      throw new BadRequestException('Sua conta não é uma conta de estudante!');
    }

    const {
      data: { price },
    } = lesson;

    const props = {
      studentId: data.lessonId,
      lessonId: data.studentId,
      amountInCents: lesson.data.price,
    } satisfies CreatePaymentLessonPixDTO;

    const intent = await this.gatewayService.generatePaymentPix(props);

    return intent;
  }
}
