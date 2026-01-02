import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { InstructorProfile } from '@/domain/entities/InstructorProfile';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';

@Injectable()
export class FindInstructorProfileUseCase {
  constructor(private readonly instructorProfileRepository: InstructorProfileRepository) {}

  public async execute(userId: string): Promise<InstructorProfile> {
    const profile = await this.instructorProfileRepository.findByUserId(userId);

    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    return profile;
  }
}
