import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { UserLevel } from './user_level.model';

@Index(['name'])
@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

}
