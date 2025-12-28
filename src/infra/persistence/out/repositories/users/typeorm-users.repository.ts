import { UsersRepository } from '@/application/ports/out/users.repository';
import { User } from '@/domain/entities/User';
import { BaseRepository } from '@/infra/utils/base-repository';
import { UserPersistenceMapper } from '../../mappers/user.persistence.mapper';
import { UserEntity } from '../../schemas/User.entity';

export class TypeormUserRepository extends BaseRepository<UserEntity> implements UsersRepository {
  constructor() {
    super(UserEntity);
  }

  async save(user: User): Promise<void> {
    const entity = UserPersistenceMapper.toEntity(user);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? UserPersistenceMapper.toModel(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    return entity ? UserPersistenceMapper.toModel(entity) : null;
  }
}
