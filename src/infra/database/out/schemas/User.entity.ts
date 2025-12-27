import { UserRole } from "@/domain/enums/UserRole";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  isVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column("simple-json")
  roles!: UserRole[];
}
