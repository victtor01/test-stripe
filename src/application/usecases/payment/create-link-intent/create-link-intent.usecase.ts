import { CreatePaymentLessonDTO } from '@/application/dtos/create-payment-pix.dto';
import { LinkPaymentResponse } from '@/application/dtos/link-payment-response.dto';
import { PaymentService } from '@/application/ports/in/payment.service';
import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { CreateLinkIntentCommand } from './create-link-intent.command';

@Injectable()
export class CreateLinkIntentUseCase {
  constructor(
    private readonly gatewayService: PaymentService,
    private readonly lessonRepository: LessonRepository,
    private readonly usersRepository: UsersRepository,
    private readonly instructorProfileRepo: InstructorProfileRepository,
  ) {}

  async execute(data: CreateLinkIntentCommand): Promise<LinkPaymentResponse> {
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

    const instructor = await this.instructorProfileRepo.findByUserId(lesson.data.instructorId);

    if (!instructor?.data.stripeAccountId) {
      throw new BadRequestException(
        'O isntructor não pode receber pagamentos no momento, tente novmaente mais tarde!',
      );
    }

    const props = {
      studentId: data.studentId,
      lessonId: data.lessonId,
      amountInCents: lesson.data.price,
      instructorId: instructor.data.stripeAccountId,
    } satisfies CreatePaymentLessonDTO;

    const intent = await this.gatewayService.generatePaymentLink(props);

    return intent;
  }
}
