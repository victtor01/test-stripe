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
  createdAt: Date;
  updatedAt: Date;
}

type OmittedItems = 'createdAt' | 'updatedAt' | 'onboardingCompleted';

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
        onboardingCompleted: false,
      },
      UuidId.create(),
    );
  }

  // Para reconstituir do banco de dad  os (Hydration)
  public static restore(props: InstructorProfileProps, id: string): InstructorProfile {
    return new InstructorProfile(props, new UuidId(id));
  }

  // Exemplo de método de domínio para alteração de estado
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

  public completeOnboarding() {
    this.props.onboardingCompleted = true;
  }

  public updateStripeAccountId(stripeAccountId: string) {
    this.props.stripeAccountId = stripeAccountId;
  }
}
