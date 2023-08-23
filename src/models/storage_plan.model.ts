import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['customer_order_number', 'order_number'])
@Entity({ name: 'storage_plans' })
export class StoragePlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
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
  state: number;

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
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];
}
