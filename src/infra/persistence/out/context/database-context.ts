import { DataSource } from 'typeorm';
import { InstructorProfileEntity } from '../schemas/InstructorProfile.entity';
import { LessonEntity } from '../schemas/Lesson.entity';
import { StudentProfileEntity } from '../schemas/StudentProfile.entity';
import { UserEntity } from '../schemas/User.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [UserEntity, InstructorProfileEntity, StudentProfileEntity, LessonEntity],
});
