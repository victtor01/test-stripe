import { InstructorProfile } from '@/domain/entities/InstructorProfile';

export abstract class InstructorProfileRepository {
  abstract findByUserId(userId: string): Promise<InstructorProfile | null>;
  abstract save(instructorProfile: InstructorProfile): Promise<void>;
  abstract update(profile: InstructorProfile): Promise<void>;
  abstract findByStripeAccountId(stripeAccountId: string): Promise<InstructorProfile | null>;
}
