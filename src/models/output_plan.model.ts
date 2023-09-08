import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.model';
import { IsOptional } from 'class-validator';

@Index(['output_number'])
@Entity({ name: 'output_plans' })
export class OutputPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  output_number: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsOptional()
  user_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsOptional()
  warehouse_id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  country: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  city: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  address: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  observations: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  delivered_time: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsOptional()
  type: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @IsOptional()
  box_amount: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @IsOptional()
  palets_amount: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @IsOptional()
  output_boxes: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @IsOptional()
  amount: number;

  @Column({
    type: 'integer',
    nullable: true,
    default: 0,
  })
  @IsOptional()
  delivered_quantity: number;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
    default: [],
  })
  case_numbers: string[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  state: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

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
