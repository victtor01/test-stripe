import { Entity } from './entity';

interface StudentProfileProps {
  userId: string;
  interests: string[]; // Ex: ['Mobile', 'Backend']
  createdAt: Date;
  updatedAt: Date;
}

type OmittedItems = 'createdAt' | 'updatedAt';

export type CreateStudentProfileProps = Omit<StudentProfileProps, OmittedItems>;

export class StudentProfile extends Entity<StudentProfileProps> {
  get data() {
    return this.snapshot();
  }

  private constructor(props: StudentProfileProps, id?: string) {
    super(props, id);
  }

  public static create(props: CreateStudentProfileProps, id?: string) {
    return new StudentProfile(
      {
        ...props,
        interests: props.interests ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }

  public static restore(props: StudentProfileProps, id: string): StudentProfile {
    return new StudentProfile(props, id);
  }

  public addInterest(interest: string) {
    if (!this.props.interests.includes(interest)) {
      this.props.interests.push(interest);
      this.props.updatedAt = new Date();
    }
  }
}
