import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { StaffState } from "./staffState.model";
import { Organization } from "./organization.model";
import { Warehouse } from "./warehouse.model";
import { Role } from "./role.model";
import { User } from "./user.model";

@Index(["username"])
@Entity({ name: "staff" })
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  chinesse_name: string;

  @Column({
    nullable: true,
    default: null,
  })
  english_name: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
    default: null,
  })
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  phone: string;

  @Column({
    nullable: true,
    default: null,
  })
  observations: string;

  @Column()
  stateId: number;

  @Column()
  organizationId: number;

  @Column()
  roleId: number;

  //@ManyToOne(() => StaffState, (staffState) => staffState.staff)
  //states: StaffState;

  @ManyToOne((type) => StaffState, (staffState) => staffState.staffs)
  @JoinColumn({ name: "stateId", referencedColumnName: "id" })
  states: StaffState;

  //@ManyToOne(() => Organization, (organization) => organization.staff)
  //organizations: Organization;

  @ManyToOne((type) => Organization, (organization) => organization.staffs)
  @JoinColumn({ name: "organizationId", referencedColumnName: "id" })
  organizations: Organization;

  //@ManyToMany(() => Warehouse, (warehouse) => warehouse.staff)
  //@JoinTable()
  //warehouses: Warehouse[];

  @ManyToMany(() => Warehouse, (warehouse) => warehouse.staff)
  @JoinTable({
    name: "staff_warehouses_warehouse",
    joinColumn: {
      name: "staffId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "warehouseId",
      referencedColumnName: "id",
    },
  })
  warehouses: Warehouse[];

  //@ManyToOne(() => Role, (role) => role.staff)
  //roles: Role;

  @ManyToOne((type) => Role, (role) => role.staffs)
  @JoinColumn({ name: "roleId", referencedColumnName: "id" })
  roles: Role;

  @OneToMany((type) => User, (user) => user.finantial_representatives)
  @JoinColumn({ referencedColumnName: "finantial_representative " })
  finantial_representatives: User[];

  @OneToMany((type) => User, (user) => user.client_service_representatives)
  @JoinColumn({ referencedColumnName: "client_service_representative " })
  client_service_representative: User[];

  @OneToMany((type) => User, (user) => user.sales_representatives)
  @JoinColumn({ referencedColumnName: "sales_representative " })
  sales_representatives: User[];

  @OneToMany((type) => User, (user) => user.sales_representatives)
  @JoinColumn({ referencedColumnName: "sales_source " })
  sales_sources: User[];
}
