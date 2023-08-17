import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.model';

@Index(['name'])
@Entity({ name: 'subsidiaries' })
export class Subsidiary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

}
