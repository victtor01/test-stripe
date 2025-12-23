import { InstructorResponseDTO } from "@/api/dtos/response/instructor-response.dto";
import { User } from "@/domain/entities/User";

export class InstructorResponseMapper {
  public static toResponse(user: User): InstructorResponseDTO {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name,
    };
  }
}
