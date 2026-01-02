import { CreateUserSchema } from "@/api/schemas/users/create-instructor.schema";
import { HashService } from "@/application/ports/in/hash.service";
import { UsersRepository } from "@/application/ports/out/users.repository";
import { Email } from "@/domain/entities/Email";
import { User } from "@/domain/entities/User";
import { Injectable } from "@/infra/decorators/injectable.decorator";
import { BadRequestException } from "@/shared/errors/BadRequestException";

@Injectable()
export class CreateStudentUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashService: HashService
	) {}

	public async execute(data: CreateUserSchema): Promise<User> {
		const userExists = await this.usersRepository.findByEmail(data.email);

		if (userExists) {
			throw new BadRequestException("User already exists");
		}

		const hashPass: string = await this.hashService.hash(data.password);

		const student = User.createStudent({
			name: data.name,
			email: Email.create(data.email),
			isVerified: false,
			password: hashPass,
		});

		await this.usersRepository.save(student);

		return student;
	}
}
