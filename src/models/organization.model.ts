import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { Staff } from "./staff.model";

@Index(["name"])
@Entity({ name: "organizations" })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  parent_organization: string;

  @Column()
  organization_type: string;

  //@OneToMany(() => Staff, (staff) => staff.organizations)
  //staff: Staff[]

  @OneToMany((type) => Staff, (staff) => staff.organizations)
  @JoinColumn({ referencedColumnName: "organization_id " })
  staffs: Staff[];
}
