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
import { UserEntity } from './User.entity';

@Entity('lessons')
export class LessonEntity {
  @PrimaryColumn('uuid')
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

  @Column()
  scheduledDate!: Date;

  @Column('int')
  durationInMinutes!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ length: 3, default: 'BRL' })
  currency!: string;

  @Column()
  topic!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  meetingUrl?: string;

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
