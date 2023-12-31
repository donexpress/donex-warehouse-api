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
} from 'typeorm';
import { Organization } from './organization.model';
import { Warehouse } from './warehouse.model';
import { Role } from './role.model';
import { User } from './user.model';

@Index(['username'])
@Entity({ name: 'staff' })
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
  })
  english_name: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  observations: string;

  @Column({
    nullable: true
  })
  state_id: number;

  @Column({
    nullable: true
  })
  organization_id: number;

  @Column({
    nullable: true
  })
  role_id: number;

  @Column({
    nullable: true
  })
  default_cargo_station_id: number;

  @Column({
    nullable: true
  })
  change_password_on_login: boolean;

  @Column({
    nullable: true
  })
  allow_search: boolean;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @Column({
    nullable: true
  })
  state: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toISOString()
  })
  created_at: string

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toISOString()
  })
  updated_at: string

}
