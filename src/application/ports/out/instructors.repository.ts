import { User } from '@/domain/entities/User';

export abstract class InstructorsRepository {
	abstract findAll(): Promise<User[]>;
}
