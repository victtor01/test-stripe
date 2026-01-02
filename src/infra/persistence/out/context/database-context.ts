import { DataSource } from 'typeorm';
import { InstructorProfileEntity } from '../schemas/InstructorProfile.entity';
import { LessonEntity } from '../schemas/Lesson.entity';
import { StudentProfileEntity } from '../schemas/StudentProfile.entity';
import { UserEntity } from '../schemas/User.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'test_stripe',
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [UserEntity, InstructorProfileEntity, StudentProfileEntity, LessonEntity],
});
