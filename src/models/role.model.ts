import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.model';

@Index(['name'])
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  //@OneToMany(() => Staff, (staff) => staff.roles)
  //staff: Staff[]

  @OneToMany((type) => Staff, (staff) => staff.roles)
  @JoinColumn({ referencedColumnName: 'role_id ' })
  staffs: Staff[];
}
