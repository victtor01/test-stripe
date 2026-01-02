import { LessonStatus } from '@/domain/enums/LessonStatus';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { UserEntity } from './User.entity';

@Entity('lessons')
export class LessonEntity {
  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @PrimaryColumn('varchar', { length: 26 })
  id!: string;

  @Column('uuid')
  studentId!: string;

  @Column('uuid')
  instructorId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'studentId' })
  student!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'instructorId' })
  instructor!: UserEntity;

  @Column({ type: 'timestamptz' })
  startAt!: Date;

  @Column({ type: 'timestamptz' })
  endAt!: Date;

  @Column('int')
  price!: number;

  @Column({ nullable: true })
  topic?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    enum: LessonStatus,
    default: LessonStatus.PENDING_PAYMENT,
  })
  status!: LessonStatus;

  @Column({ nullable: true, unique: true })
  stripePaymentIntentId?: string;

  @Column({ nullable: true })
  stripeTransferId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
