import { UserRole } from '@/domain/enums/UserRole';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { InstructorProfileEntity } from './InstructorProfile.entity';
import { StudentProfileEntity } from './StudentProfile.entity';

@Entity()
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  isVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
  })
  roles!: UserRole[];

  @OneToOne(() => InstructorProfileEntity, (instructor) => instructor.user)
  instructorProfile?: InstructorProfileEntity;

  @OneToOne(() => StudentProfileEntity, (student) => student.user)
  studentProfile?: StudentProfileEntity;
}
