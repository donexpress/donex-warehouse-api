import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Service } from './service.model';
import { User } from './user.model';
import { IsOptional, Min } from 'class-validator';

@Index(['name'])
@Entity({ name: 'user_levels' })
export class UserLevel {
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
  })
  @IsOptional()
  observations: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  service_id: number;
  
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
