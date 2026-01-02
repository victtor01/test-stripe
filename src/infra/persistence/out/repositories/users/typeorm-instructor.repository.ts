import { InstructorsRepository } from '@/application/ports/out/instructors.repository';
import { User } from '@/domain/entities/User';
import { UserRole } from '@/domain/enums/UserRole';
import { BaseRepository } from '@/infra/utils/base-repository';
import { UserPersistenceMapper } from '../../mappers/user.persistence.mapper';
import { UserEntity } from '../../schemas/User.entity';

export class TypeormInstructorsRepository
  extends BaseRepository<UserEntity>
  implements InstructorsRepository
{
  constructor() {
    super(UserEntity);
  }

  async findAll(): Promise<User[]> {
    const usersEntities = await this.repository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', {
        role: UserRole.INSTRUCTOR,
      })
      .getMany();

    return usersEntities.map(UserPersistenceMapper.toModel);
  }
}
