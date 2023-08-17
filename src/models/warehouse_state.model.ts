import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.model';

@Index(['name'])
@Entity({ name: 'warehouses_states' })
export class WarehouseState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

}
