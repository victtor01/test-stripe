import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { InstructorProfile } from '@/domain/entities/InstructorProfile';
import { BaseRepository } from '@/infra/utils/base-repository';
import { InstructorProfilePersistenceMapper } from '../../mappers/instructor-profile.persistence.mapper';
import { InstructorProfileEntity } from '../../schemas/InstructorProfile.entity';

export class TypeormInstructorProfileRepository
  extends BaseRepository<InstructorProfileEntity>
  implements InstructorProfileRepository
{
  constructor() {
    super(InstructorProfileEntity);
  }
  
  async findByStripeAccountId(stripeAccountId: string): Promise<InstructorProfile | null> {
    return await this.repository
      .findOne({ where: { stripeAccountId } })
      .then((entity) => InstructorProfilePersistenceMapper.toModel(entity));
  }

  async findByUserId(userId: string): Promise<InstructorProfile | null> {
    console.log("userId", userId)
    const instructorProfileEntity = await this.repository.findOne({ where: { userId } });
    return InstructorProfilePersistenceMapper.toModel(instructorProfileEntity);
  }

  async save(instructorProfile: InstructorProfile): Promise<void> {
    const instructorProfileEntity = InstructorProfilePersistenceMapper.toEntity(instructorProfile);
    console.log(instructorProfileEntity);
    await this.repository.save(instructorProfileEntity);
  }
}
