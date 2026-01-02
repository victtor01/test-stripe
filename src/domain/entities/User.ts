import { UserRole } from '../enums/UserRole';
import { InvalidLengthException } from '../exceptions/InvalidLengthException';
import { nameof } from '../utils/nameof-utils';
import { UuidId } from '../values/uuid-id';
import { Email } from './Email';
import { Entity } from './entity';
import { InstructorProfile } from './InstructorProfile';

interface UserProps {
  email: Email;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  instructorProfile?: InstructorProfile;
  studentProfile?: InstructorProfile;
  password: string;
  roles: UserRole[];
}

type OmitedItems = 'roles' | 'createdAt';

export type CreateUserProps = Omit<UserProps, OmitedItems> & {
  createdAt?: Date;
};

export class User extends Entity<UserProps, UuidId> {
  private static readonly NAME_MIN_LENGTH = 5;
  private static readonly NAME_MAX_LENGTH = 100;

  protected nextId(): string {
    return crypto.randomUUID();
  }

  get data() {
    return this.snapshot();
  }

  private constructor(props: UserProps, id?: UuidId) {
    if (props.name?.length < 5) {
      throw new InvalidLengthException(
        nameof<UserProps>((u) => u.name),
        User.NAME_MIN_LENGTH,
        User.NAME_MAX_LENGTH,
      );
    }

    super(props, id || UuidId.create());
  }

  public static createInstructor(props: CreateUserProps) {
    return new User(
      {
        ...props,
        roles: [UserRole.INSTRUCTOR],
        createdAt: props.createdAt ?? new Date(),
      },
      UuidId.create(),
    );
  }

  public static createStudent(props: CreateUserProps) {
    return new User(
      {
        ...props,
        roles: [UserRole.STUDENT],
        createdAt: props.createdAt ?? new Date(),
      },
      UuidId.create(),
    );
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, new UuidId(id));
  }

  public createInstructorProfile(profile: InstructorProfile) {
    if (this.props.roles.includes(UserRole.INSTRUCTOR)) {
      return;
    }

    this.props;
    this.props.roles.push(UserRole.INSTRUCTOR);
  }

  public createStudentProfile() {
    if (this.props.roles.includes(UserRole.STUDENT)) {
      return;
    }

    this.props.roles.push(UserRole.STUDENT);
  }

  public isStudent() {
    return this.data.roles.includes(UserRole.STUDENT);
  }

  public isInstructor() {
    return this.data.roles.includes(UserRole.INSTRUCTOR);
  }
}
