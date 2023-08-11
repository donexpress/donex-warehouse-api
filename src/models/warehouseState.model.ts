import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { Warehouse } from "./warehouse.model";

@Index(["name"])
@Entity({ name: "warehouses_states" })
export class WarehouseState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //@OneToMany(() => Warehouse, (warehouse) => warehouse.states)
  //warehouses: Warehouse[];

  @OneToMany((type) => Warehouse, (warehouse) => warehouse.states)
  @JoinColumn({ referencedColumnName: "stateId " })
  staffs: Warehouse[];
}
