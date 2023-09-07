import { IsNumber, Min } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['id'])
@Entity({ name: 'shelves' })
export class Shelf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @Min(1)
  partition_table: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @Min(1)
  warehouse_id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  @Min(1)
  number_of_shelves: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  layers: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  column_ammount: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  location_length: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  location_width: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  high_inventory: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  shelves_type_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  location_type_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  billing_mode_id: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  designated_user: number;

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
