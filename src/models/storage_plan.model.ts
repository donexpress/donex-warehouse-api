import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['customer_order_number', 'order_number'])
@Entity({ name: 'storage_plans' })
export class StoragePlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true
  })
  customer_order_number: string;

  @Column({
    nullable: true,
  })
  warehouse_id: number;

  @Column({
    nullable: true,
  })
  type: number;

  @Column({
    nullable: true,
  })
  box_amount: number;

  @Column({
    nullable: true,
  })
  delivered_time: string;

  @Column({
    nullable: true,
  })
  observations: string;

  @Column({
    nullable: true,
  })
  user_id: number;

  @Column({
    nullable: true,
  })
  order_number: string;

  @Column({
    nullable: true,
  })
  state: string;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  weight: number;

  @Column({
    nullable: true,
  })
  volume: number;

  @Column({
    nullable: true,
  })
  out_boxes: number;

  @Column({
    nullable: true,
  })
  stock_boxes: number;

  @Column({
    nullable: true,
    type: 'json',
    default: [],
  })
  history: object[];

  @Column({
    nullable: true,
  })
  ready: boolean;

  @Column({
    nullable: true,
  })
  changes: boolean;

  @Column({
    nullable: true,
    default: false,
    type: 'boolean'
  })
  rejected_boxes: boolean

  @Column({
    nullable: true,
    default: false,
    type: 'boolean'
  })
  return: boolean

  @Column({
    nullable: true,
    type: 'varchar'
  })
  reference_number: string;

  @Column({
    nullable: true,
    type: 'varchar'
  })
  pr_number: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  images: object[];

  @Column({
    default: false,
    type: 'boolean'
  })
  is_images: boolean

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toISOString()
  })
  created_at: string

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toISOString()
  })
  updated_at: string
}
