import { UserRole } from "../enums/UserRole";
import { InvalidLengthException } from "../exceptions/InvalidLengthException";
import { nameof } from "../utils/nameof-utils";
import { Email } from "./Email";
import { Entity } from "./entity";

interface UserProps {
  email: Email;
  name: string;
  isVerified: boolean;

  createdAt: Date;
  roles: UserRole[];
}

type OmitedItems = "roles" | "createdAt";

export type CreateUserProps = Omit<UserProps, OmitedItems> & {
  createdAt?: Date;
};

export class User extends Entity<UserProps> {
  private static readonly NAME_MIN_LENGTH = 5;
  private static readonly NAME_MAX_LENGTH = 100;

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  private constructor(props: UserProps, id?: string) {
    if (props.name?.length < 5) {
      throw new InvalidLengthException(
        nameof<UserProps>((u) => u.name),
        User.NAME_MIN_LENGTH,
        User.NAME_MAX_LENGTH
      );
    }

    super(props, id);
  }

  public static createInstructor(props: CreateUserProps, id?: string) {
    return new User(
      {
        ...props,
        roles: [UserRole.INSTRUCTOR],
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  public static createStudent(props: CreateUserProps, id?: string) {
    return new User(
      {
        ...props,
        roles: [UserRole.STUDENT],
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
