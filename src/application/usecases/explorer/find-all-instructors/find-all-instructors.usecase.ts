import { InstructorsRepository } from '@/application/ports/out/instructors.repository';
import { User } from '@/domain/entities/User';
import { Injectable } from '@/infra/decorators/injectable.decorator';

@Injectable()
export class FindAllInstructorsUseCase {
  constructor(private readonly instructorsRepository: InstructorsRepository) {}

  async execute(): Promise<User[]> {
    return this.instructorsRepository.findAll();
  }
}
