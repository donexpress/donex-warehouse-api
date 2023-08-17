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
import { StaffState } from './staff_state.model';
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

}
