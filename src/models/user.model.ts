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
    default: null
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
    nullable: true,
  })
  state_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  finantial_representative: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  client_service_representative: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  sales_representative: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  sales_source: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  subsidiary_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  regional_division_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  warehouse_id: number;

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
    nullable: true,
  })
  user_level_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  payment_method_id: number;
}
