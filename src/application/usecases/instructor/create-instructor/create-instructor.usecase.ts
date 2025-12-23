import { CreateInstructorSchema } from "@/api/schemas/users/create-instructor.schema";
import { Email } from "@/domain/entities/Email";
import { User } from "@/domain/entities/User";

export class CreateInstructorUseCase {
  public async execute(data: CreateInstructorSchema): Promise<User> {
    const instructor = User.createInstructor({
      name: data.name,
      email: Email.create(data.email),
      isVerified: false,
    });

    return instructor;
  }
}
