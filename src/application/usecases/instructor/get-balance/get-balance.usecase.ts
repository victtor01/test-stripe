import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';

@Injectable()
export class GetBalanceOfInstructorUseCase {
  constructor(private readonly instructorsRepository: InstructorProfileRepository) {}

  async execute(instructorId: string) {
    const profile = await this.instructorsRepository.findByUserId(instructorId);

    return profile?.data.balance;
  }
}
