import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { Staff } from "./staff.model";
import { IsOptional } from "class-validator";

@Index(["name"])
@Entity({ name: "organizations" })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  @IsOptional()
  parent_organization: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  @IsOptional()
  organization_type: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  created_at: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  updated_at: string;
}
