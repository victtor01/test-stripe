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

@Entity('student_profiles')
export class StudentProfileEntity {
  @PrimaryColumn('uuid')
  id!: string;

  // Armazena string[] como JSON
  @Column('simple-json')
  interests!: string[];

  @Column('uuid')
  userId!: string;

  @OneToOne(() => UserEntity, (user) => user.studentProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
