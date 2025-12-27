import { User } from "@/domain/entities/User";

export abstract class UsersRepository {
	abstract save(user: User): Promise<void>;
	abstract findById(id: string): Promise<User | null>;
	abstract findByEmail(email: string): Promise<User | null>;
}