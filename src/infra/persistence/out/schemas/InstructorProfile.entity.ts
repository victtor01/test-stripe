import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

@Entity('instructor_profiles')
export class InstructorProfileEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('text', { nullable: true })
  biography?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column('simple-json', { nullable: true })
  specialties?: string[];

  @Column('uuid')
  userId!: string;

  @Column({ nullable: true })
  stripeAccountId?: string;

  @Column({ type: 'boolean', default: false })
  onboardingCompleted!: boolean;

  @OneToOne(() => UserEntity, (user) => user.instructorProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
