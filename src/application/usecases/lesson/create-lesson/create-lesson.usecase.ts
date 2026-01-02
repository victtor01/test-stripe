import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { Lesson } from '@/domain/entities/Lesson';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { NotFoundException } from '@/shared/errors/NotFoundException';
import { CreateLessonCommand } from './create-lesson.command';

@Injectable()
export class CreateLessonUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(data: CreateLessonCommand): Promise<Lesson> {
    const { studentId, instructorId } = data;

    if (studentId === instructorId) {
      throw new BadRequestException('O aluno não pode ser o mesmo usuário que o instrutor!');
    }

    const [student, instructor] = await Promise.all([
      this.usersRepository.findById(instructorId),
      this.usersRepository.findById(studentId),
    ]);

    if (!student || !instructor) {
      throw new NotFoundException('instrutor ou aluno não existem!');
    }

    const endAt = new Date(data.startAt.getTime() + 60 * 60 * 1000);

    const lesson = Lesson.create({
      ...data,
      endAt: endAt,
      price: 100,
    });

    await this.lessonRepository.save(lesson);

    return lesson;
  }
}
