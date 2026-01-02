import { PaymentService } from '@/application/ports/in/payment.service';
import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { Lesson } from '@/domain/entities/Lesson';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { Transactional } from '@/infra/decorators/transactional.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { NotFoundException } from '@/shared/errors/NotFoundException';
import { CompleteLessonCommand } from './complete-lesson.command';

@Injectable()
export class CompleteLessonUseCase {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly instruProfileRepository: InstructorProfileRepository,
    private readonly paymentService: PaymentService,
  ) {}

  @Transactional() 
  async execute(data: CompleteLessonCommand): Promise<Lesson> {
    const lesson = await this.lessonRepository.findById(data.lessonId);

    if (!lesson?.id) {
      throw new NotFoundException('Aula não encontrada');
    }

    if (!lesson.isPaid()) {
      throw new BadRequestException('A aula precisa estar paga para ser concluída.');
    }

    if (lesson.isCompleted()) {
      return lesson;
    }

    const { price, instructorId } = lesson.data; // Supondo que .data acessa as props
    const instructor = await this.instruProfileRepository.findByUserId(instructorId);

    if (!instructor?.id) {
      throw new BadRequestException('Perfil de instrutor não encontrado.');
    }

    const platformFeePercentage = 0.2; 
    const amountForInstructor = Math.floor(price * (1 - platformFeePercentage));

    lesson.completeLesson();

    instructor.addBalance(amountForInstructor);

    await Promise.all([
      this.instruProfileRepository.update(instructor),
      this.lessonRepository.update(lesson),
    ]);

    return lesson;
  }
}
