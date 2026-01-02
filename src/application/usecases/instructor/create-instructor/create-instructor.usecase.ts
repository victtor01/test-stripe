import { CreateUserSchema } from '@/api/schemas/users/create-instructor.schema';
import { HashService } from '@/application/ports/in/hash.service';
import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { Email } from '@/domain/entities/Email';
import { InstructorProfile } from '@/domain/entities/InstructorProfile';
import { User } from '@/domain/entities/User';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { Transactional } from '@/infra/decorators/transactional.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';

@Injectable()
export class CreateInstructorUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly instructorProfileRepository: InstructorProfileRepository,
  ) {}

  @Transactional()
  public async execute(data: CreateUserSchema): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashPass: string = await this.hashService.hash(data.password);

    const instructor = User.createInstructor({
      name: data.name,
      email: Email.create(data.email),
      isVerified: false,
      password: hashPass,
    });

    const instructorProfile = InstructorProfile.create({
      userId: instructor.id.toString(),
    });

    await this.usersRepository.save(instructor);
    await this.instructorProfileRepository.save(instructorProfile);

    return instructor;
  }
}
