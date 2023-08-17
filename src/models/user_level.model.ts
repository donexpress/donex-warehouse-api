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
import { IsInt, IsOptional, Min } from 'class-validator';

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
  @IsInt()
  @Min(1)
  service_id: number;
}
