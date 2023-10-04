import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.model';
import { IsOptional } from 'class-validator';

@Index(['name'])
@Entity({ name: 'regional_divisions' })
export class RegionalDivision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsOptional()
  type: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsOptional()
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsOptional()
  company: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsOptional()
  country: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsOptional()
  cp: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsOptional()
  rules: string;

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
