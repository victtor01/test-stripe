import { Lesson } from '@/domain/entities/Lesson';

export abstract class LessonRepository {
  abstract save(lesson: Lesson): Promise<void>;
  abstract update(lesson: Lesson): Promise<void>;
  abstract findById(id: string): Promise<Lesson | null>;
  abstract findAllByStudent(studentId: string): Promise<Lesson[]>;
  abstract findPendingPayoutsByInstructorId(instructorId: string): Promise<Lesson[]>;
}
