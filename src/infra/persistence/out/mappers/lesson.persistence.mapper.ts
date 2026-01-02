import { Lesson } from '@/domain/entities/Lesson';
import { LessonEntity } from '../schemas/Lesson.entity';

export class LessonPersistenceMapper {
  static toModel(entity?: LessonEntity | null): Lesson | null {
    if (!entity) return null;

    return Lesson.restore(
      {
        studentId: entity.studentId,
        instructorId: entity.instructorId,
        price: entity.price,
        topic: entity.topic,
        description: entity.description,
        status: entity.status,
        stripePaymentIntentId: entity.stripePaymentIntentId,
        stripeTransferId: entity.stripeTransferId,
        createdAt: entity.createdAt,
        startAt: entity.startAt,
        endAt: entity.endAt,
        updatedAt: entity.updatedAt,
      },
      entity.id,
    );
  }

  static toEntity(model: Lesson): LessonEntity {
    const entity = new LessonEntity();

    entity.id = model.id.toString();
    entity.studentId = model.data.studentId;
    entity.instructorId = model.data.instructorId;
    entity.price = model.data.price;
    entity.topic = model.data.topic;
    entity.description = model.data.description;
    entity.status = model.data.status;
    entity.stripePaymentIntentId = model.data.stripePaymentIntentId;
    entity.stripeTransferId = model.data.stripeTransferId;
    entity.createdAt = model.data.createdAt;
    entity.updatedAt = model.data.updatedAt;
    entity.startAt = model.data.startAt;
    entity.endAt = model.data.endAt;

    return entity;
  }
}
