import { UsersRepository } from "@/application/ports/out/users.repository";
import { User } from "@/domain/entities/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../../context/database-context";
import { UserMapper } from "../../mappers/user-db.mapper";
import { UserEntity } from "../../schemas/User.entity";

export class TypeormUserRepository implements UsersRepository {
  private ormRepo: Repository<UserEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.ormRepo.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    return entity ? UserMapper.toModel(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOneBy({ email });
    return entity ? UserMapper.toModel(entity) : null;
  }
}
