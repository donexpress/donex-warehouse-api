import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsBoolean, IsOptional } from 'class-validator';

@Index(['number_delivery', 'warehouse_id'])
@Entity({ name: 'operation_instructions' })
export class OperationInstruction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  operation_instruction_type: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  warehouse_id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  output_plan_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  user_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  number_delivery: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  remark: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  internal_remark: string;

  @IsBoolean()
  @Column({
    default: false
  })
  client_display: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  state: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
