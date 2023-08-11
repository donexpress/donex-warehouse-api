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
@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //@OneToMany(() => Staff, (staff) => staff.roles)
  //staff: Staff[]

  @OneToMany((type) => Staff, (staff) => staff.roles)
  @JoinColumn({ referencedColumnName: "roleId " })
  staffs: Staff[];
}
