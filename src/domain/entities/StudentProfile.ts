import { UuidId } from '../values/uuid-id';
import { Entity } from './entity';

interface StudentProfileProps {
  userId: string;
  interests: string[]; // Ex: ['Mobile', 'Backend']
  createdAt: Date;
  updatedAt: Date;
}

type OmittedItems = 'createdAt' | 'updatedAt';

export type CreateStudentProfileProps = Omit<StudentProfileProps, OmittedItems>;

export class StudentProfile extends Entity<StudentProfileProps, UuidId> {
  protected nextId(): string {
    return crypto.randomUUID();
  }

  get data() {
    return this.snapshot();
  }

  private constructor(props: StudentProfileProps, id?: UuidId) {
    super(props, id || UuidId.create());
  }

  public static create(props: CreateStudentProfileProps) {
    return new StudentProfile(
      {
        ...props,
        interests: props.interests ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      UuidId.create(),
    );
  }

  public static restore(props: StudentProfileProps, id: string): StudentProfile {
    return new StudentProfile(props, new UuidId(id));
  }

  public addInterest(interest: string) {
    if (!this.props.interests.includes(interest)) {
      this.props.interests.push(interest);
      this.props.updatedAt = new Date();
    }
  }
}
