import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { Lesson } from '@/domain/entities/Lesson';
import { Injectable } from '@/infra/decorators/injectable.decorator';

@Injectable()
export class FindLessonsByStudentUseCase {
  constructor(private readonly lessonsRepository: LessonRepository) {}

  async execute(studentId: string): Promise<Lesson[]> {
    return this.lessonsRepository.findAllByStudent(studentId);
  }
}
