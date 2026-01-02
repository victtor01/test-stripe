import { InstructorProfile } from '@/domain/entities/InstructorProfile';
import { InstructorProfileEntity } from '../schemas/InstructorProfile.entity';

export class InstructorProfilePersistenceMapper {
  static toModel(entity: InstructorProfileEntity | null): InstructorProfile | null {
    if (!entity) return null;

    return InstructorProfile.restore(
      {
        userId: entity.userId,
        biography: entity.biography,
        specialties: entity.specialties,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        linkedinUrl: entity.linkedinUrl,
        stripeAccountId: entity.stripeAccountId,
        onboardingCompleted: entity.onboardingCompleted,
      },
      entity.id,
    );
  }

  static toEntity(model: InstructorProfile): InstructorProfileEntity {
    const entity = new InstructorProfileEntity();

    entity.id = model.id.toString();
    entity.userId = model.data.userId;
    entity.biography = model.data.biography;
    entity.specialties = model.data.specialties;
    entity.createdAt = model.data.createdAt;
    entity.updatedAt = model.data.updatedAt;
    entity.linkedinUrl = model.data.linkedinUrl;
    entity.stripeAccountId = model.data.stripeAccountId;
    entity.onboardingCompleted = model.data.onboardingCompleted;

    return entity;
  }
}
