import { InvalidLengthException } from '../exceptions/InvalidLengthException';
import { nameof } from '../utils/nameof-utils';
import { UuidId } from '../values/uuid-id';
import { Entity } from './entity';

interface InstructorProfileProps {
  userId: string;
  biography?: string;
  specialties?: string[];
  linkedinUrl?: string;
  stripeAccountId?: string;
  onboardingCompleted: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

type OmittedItems = 'createdAt' | 'updatedAt' | 'onboardingCompleted' | 'balance';

export type CreateInstructorProfileProps = Omit<InstructorProfileProps, OmittedItems>;

export class InstructorProfile extends Entity<InstructorProfileProps, UuidId> {
  private static readonly BIO_MIN_LENGTH = 10;
  private static readonly BIO_MAX_LENGTH = 5000;

  protected nextId(): string {
    return crypto.randomUUID();
  }

  get data() {
    return this.snapshot();
  }

  private constructor(props: InstructorProfileProps, id?: UuidId) {
    if (props?.biography && props.biography?.length < InstructorProfile.BIO_MIN_LENGTH) {
      throw new InvalidLengthException(
        nameof<InstructorProfileProps>((p) => p.biography),
        InstructorProfile.BIO_MIN_LENGTH,
        InstructorProfile.BIO_MAX_LENGTH,
      );
    }

    super(props, id || UuidId.create());
  }

  public static create(props: CreateInstructorProfileProps, id?: string) {
    return new InstructorProfile(
      {
        ...props,
        specialties: props.specialties ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeAccountId: props.stripeAccountId,
        balance: 0,
        onboardingCompleted: false,
      },
      UuidId.create(),
    );
  }

  public static restore(props: InstructorProfileProps, id: string): InstructorProfile {
    return new InstructorProfile(props, new UuidId(id));
  }

  public updateBiography(newBio: string) {
    if (newBio.length < InstructorProfile.BIO_MIN_LENGTH) {
      throw new InvalidLengthException(
        nameof<InstructorProfileProps>((p) => p.biography),
        InstructorProfile.BIO_MIN_LENGTH,
        InstructorProfile.BIO_MAX_LENGTH,
      );
    }
    this.props.biography = newBio;
    this.props.updatedAt = new Date();
  }

  public completeOnboarding(): void {
    this.props.onboardingCompleted = true;
  }

  public updateStripeAccountId(stripeAccountId: string): void {
    this.props.stripeAccountId = stripeAccountId;
  }

  public addBalance(value: number): void {
    if (value > 0) {
      this.props.balance += value;
    }
  }

  public getBalance(): number {
    return this.props.balance;
  }
  
  public withdrawBalance(amount: number) {
    if (amount < 0) throw new Error('Valor inválido');
    if (this.props.balance < amount) throw new Error('Saldo insuficiente');

    this.props.balance -= amount;
  }
}
