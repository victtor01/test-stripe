import { ConflictException } from '@/shared/errors/ConflictException';
import { ulid } from 'ulid';
import { LessonStatus } from '../enums/LessonStatus';
import { UlidId } from '../values/ulid-id';
import { Entity } from './entity';

interface LessonProps {
  studentId: string;
  instructorId: string;
  startAt: Date;
  endAt: Date;
  price: number;
  topic?: string;
  description?: string;
  meetingUrl?: string;
  // Controle Financeiro
  status: LessonStatus;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
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

export class Lesson extends Entity<LessonProps, UlidId> {
  get data() {
    return this.snapshot();
  }

  protected nextId(): string {
    return ulid();
  }

  private constructor(props: LessonProps, id?: UlidId) {
    const now = Date.now();
    const startAt = props.startAt.getTime();

    if (startAt <= now) {
      throw new ConflictException('A aula deve ser agendada para o futuro.');
    }

    super(props, id || UlidId.create());
  }

  public static create(props: CreateLessonProps) {
    return new Lesson(
      {
        ...props,
        status: LessonStatus.PENDING_PAYMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      UlidId.create(),
    );
  }

  public static restore(props: LessonProps, id: string): Lesson {
    return new Lesson(props, new UlidId(id));
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
