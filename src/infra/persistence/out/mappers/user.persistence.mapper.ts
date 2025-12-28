import { Email } from "@/domain/entities/Email";
import { User } from "@/domain/entities/User";
import { UserEntity } from "../schemas/User.entity";

export class UserPersistenceMapper {
  static toModel(entity: UserEntity): User {
    return User.restore(
      {
        email: Email.create(entity.email),
        name: entity.name,
        roles: entity.roles,
        isVerified: entity.isVerified,
        createdAt: entity.createdAt,
        password: entity.password,
      },
      entity.id
    );
  }

  static toEntity(model: User): UserEntity {
    const entity = new UserEntity();

    entity.id = model.id;
    entity.email = model.data.email.getValue();
    entity.name = model.data.name;
    entity.isVerified = model.data.isVerified;
    entity.password = model.data.password;
    entity.roles = model.data.roles;
    entity.createdAt = model.data.createdAt;

    return entity;
  }
}
