import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { Lesson } from '@/domain/entities/Lesson';
import { BaseRepository } from '@/infra/utils/base-repository';
import { LessonPersistenceMapper } from '../../mappers/lesson.persistence.mapper';
import { LessonEntity } from '../../schemas/Lesson.entity';

export class TypeormLessonRepository
  extends BaseRepository<LessonEntity>
  implements LessonRepository
{
  constructor() {
    super(LessonEntity);
  }

  async findAllByStudent(studentId: string): Promise<Lesson[]> {
    const lessons = await this.repository.find({
      where: { studentId },
    });

    if (!lessons?.length) {
      return [];
    }

    return lessons
      .map((l) => LessonPersistenceMapper.toModel(l))
      .filter((l): l is Lesson => l !== null);
  }

  async save(lesson: Lesson): Promise<void> {
    await this.repository.save(LessonPersistenceMapper.toEntity(lesson));
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = await this.repository.findOne({ where: { id } });
    return LessonPersistenceMapper.toModel(lesson);
  }
}
