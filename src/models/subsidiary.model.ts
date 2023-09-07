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

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  created_at: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  updated_at: string;
}
