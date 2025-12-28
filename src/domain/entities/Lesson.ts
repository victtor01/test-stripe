// src/domain/entities/Lesson.ts
import { ConflictException } from '@/shared/errors/ConflictException';
import { LessonStatus } from '../enums/LessonStatus';
import { Entity } from './entity';

interface LessonProps {
  studentId: string;
  instructorId: string;
  scheduledDate: Date;
  durationInMinutes: number;
  price: number;
  currency: string; // 'BRL', 'USD'
  topic: string;
  description?: string;
  meetingUrl?: string; // Link do Google Meet/Zoom

  // Controle Financeiro
  status: LessonStatus;
  stripePaymentIntentId?: string; // ID da transação no Stripe (para capturar/estornar)
  stripeTransferId?: string; // ID da transferência para o instrutor

  createdAt: Date;
  updatedAt: Date;
}

type OmittedItems =
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'stripePaymentIntentId'
  | 'stripeTransferId';

export type CreateLessonProps = Omit<LessonProps, OmittedItems>;

export class Lesson extends Entity<LessonProps> {
  get data() {
    return this.snapshot();
  }

  private constructor(props: LessonProps, id?: string) {
    if (props.scheduledDate < new Date()) {
      throw new ConflictException('A aula não pode ser agendada no passado.');
    }
    super(props, id);
  }

  public static create(props: CreateLessonProps, id?: string) {
    return new Lesson(
      {
        ...props,
        status: LessonStatus.PENDING_PAYMENT,
        currency: props.currency || 'BRL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }

  public static restore(props: LessonProps, id: string): Lesson {
    return new Lesson(props, id);
  }

  public markAsPaid(paymentIntentId: string) {
    if (this.props.status !== LessonStatus.PENDING_PAYMENT) {
      throw new ConflictException('Apenas aulas pendentes podem ser pagas.');
    }
    this.props.stripePaymentIntentId = paymentIntentId;
    this.props.status = LessonStatus.SCHEDULED;
    this.props.updatedAt = new Date();
  }

  public completeLesson() {
    if (this.props.status !== LessonStatus.SCHEDULED) {
      throw new ConflictException('A aula precisa estar agendada para ser concluída.');
    }
    this.props.status = LessonStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  public releaseFunds(transferId: string) {
    if (this.props.status !== LessonStatus.COMPLETED) {
      throw new ConflictException('O dinheiro só pode ser liberado após a conclusão da aula.');
    }
    this.props.stripeTransferId = transferId;
    this.props.status = LessonStatus.FUNDS_RELEASED;
    this.props.updatedAt = new Date();
  }

  public cancel() {
    if (this.props.status === LessonStatus.FUNDS_RELEASED) {
      throw new ConflictException('Não é possível cancelar uma aula já paga ao instrutor.');
    }
    this.props.status = LessonStatus.CANCELED;
    this.props.updatedAt = new Date();
  }
}
