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
@Entity({ name: "staff_states" })
export class StaffState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false,
  })
  name: string;

  @OneToMany((type) => Staff, (staff) => staff.states)
  @JoinColumn({ referencedColumnName: "state_id" })
  staffs: Staff[];
}