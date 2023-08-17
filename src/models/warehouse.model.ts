import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  Index,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { WarehouseState } from "./warehouse_state.model";
import { Staff } from "./staff.model";
import { User } from "./user.model";

@Index(["name", "receiving_area"])
@Entity({ name: "warehouses" })
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  english_name: string;

  @Column({
    nullable: false,
  })
  receiving_area: string;

  @Column({
    nullable: false,
  })
  principal: string;

  @Column()
  contact_phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  country: string;

  @Column()
  cp: string;

  @Column()
  shared_warehouse_system_code: string;

  @Column()
  shared_warehouse_docking_code: string;

  @Column()
  customer_order_number_rules: string;

  @Column()
  state_id: number;

  //@ManyToOne(() => WarehouseState, (warehouseState) => warehouseState.warehouses)
  //states: WarehouseState

  @ManyToOne(
    (type) => WarehouseState,
    (warehouseState) => warehouseState.staffs
  )
  @JoinColumn({ name: "state_id", referencedColumnName: "id" })
  states: WarehouseState;

  @ManyToMany(() => Staff, (staff) => staff.warehouses)
  staff: Staff[];

  @OneToMany((type) => User, (user) => user.warehouses)
  @JoinColumn({ referencedColumnName: "warehouse_id " })
  users: User[];
}
