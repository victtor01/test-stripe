import { CreateInstructorSchema } from "@/api/schemas/users/create-instructor.schema";
import { HashService } from "@/application/ports/in/hash.service";
import { UsersRepository } from "@/application/ports/out/users.repository";
import { Email } from "@/domain/entities/Email";
import { User } from "@/domain/entities/User";
import { Injectable } from "@/infra/decorators/injectable.decorator";
import { BadRequestException } from "@/shared/errors/BadRequestException";

@Injectable()
export class CreateInstructorUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService
  ) {}

  public async execute(data: CreateInstructorSchema): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const hashPass: string = await this.hashService.hash(data.password);

    const instructor = User.createInstructor({
      name: data.name,
      email: Email.create(data.email),
      isVerified: false,
      password: hashPass,
    });

    await this.usersRepository.save(instructor);

    return instructor;
  }
}
