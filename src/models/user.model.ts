import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserState } from './user_state.model';
import { Staff } from './staff.model';
import { Subsidiary } from './subsidiary.model';
import { RegionalDivision } from './regional_division.model';
import { Warehouse } from './warehouse.model';
import { UserLevel } from './user_level.model';
import { PaymentMethod } from './payment_method.model';
import {
  IsOptional,
  IsInt,
  Min,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

@Index(['username'])
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  customer_number: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  label_code: string;

  @Column()
  password: string;

  @Column()
  contact: string;

  @Column()
  company: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  //@IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column()
  qq: string;

  @Column()
  credits: string;

  @Column()
  observations: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsOptional()
  //@IsInt()
  //@Min(1)
  state_id: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  finantial_representative: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  client_service_representative: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  sales_representative: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  sales_source: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  subsidiary_id: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  regional_division_id: number | null;

  @Column({
    type: 'integer',
    nullable: true,
  })
  //@IsInt()
  //@Min(1)
  warehouse_id: number | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  shipping_control: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  hidde_transfer_order: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  reset_password: boolean;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  user_level_id: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  //@IsInt()
  //@Min(1)
  payment_method_id: number | null;

  @ManyToOne((type) => UserState, (state) => state.users)
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  states: UserState | null;

  @ManyToOne((type) => Staff, (staff) => staff.finantial_representatives)
  @JoinColumn({ name: 'finantial_representative', referencedColumnName: 'id' })
  finantial_representatives: Staff | null;

  @ManyToOne((type) => Staff, (staff) => staff.client_service_representative)
  @JoinColumn({
    name: 'client_service_representative',
    referencedColumnName: 'id',
  })
  client_service_representatives: Staff | null;

  @ManyToOne((type) => Staff, (staff) => staff.sales_representatives)
  @JoinColumn({ name: 'sales_representative', referencedColumnName: 'id' })
  sales_representatives: Staff | null;

  @ManyToOne((type) => Staff, (staff) => staff.sales_sources)
  @JoinColumn({ name: 'sales_source', referencedColumnName: 'id' })
  sales_sources: Staff | null;

  @ManyToOne((type) => Subsidiary, (subsidiary) => subsidiary.users)
  @JoinColumn({ name: 'subsidiary_id', referencedColumnName: 'id' })
  subsidiaries: Subsidiary | null;

  @ManyToOne(
    (type) => RegionalDivision,
    (regionalDivision) => regionalDivision.users
  )
  @JoinColumn({ name: 'regional_division_id', referencedColumnName: 'id' })
  regional_divisions: RegionalDivision | null;

  @ManyToOne((type) => Warehouse, (warehouse) => warehouse.users)
  @JoinColumn({ name: 'warehouse_id', referencedColumnName: 'id' })
  warehouses: RegionalDivision | null;

  @ManyToOne((type) => UserLevel, (user_level) => user_level.users)
  @JoinColumn({ name: 'user_level_id', referencedColumnName: 'id' })
  user_level: UserLevel | null;

  @ManyToOne((type) => PaymentMethod, (payment_method) => payment_method.users)
  @JoinColumn({ name: 'payment_method_id', referencedColumnName: 'id' })
  payment_methods: PaymentMethod | null;
}
