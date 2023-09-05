import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['box_number'])
@Entity({ name: 'packing_lists' })
export class PackingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  box_number: string;

  @Column({
    nullable: true,
  })
  case_number: string

  @Column({
    nullable: true,
    default: 0
  })
  client_weight: number;

  @Column({
    nullable: true,
    default: 0
  })
  client_length: number;

  @Column({
    nullable: true,
    default: 0
  })
  client_width: number;

  @Column({
    nullable: true,
    default: 0
  })
  client_height: number;

  @Column({
    nullable: true,
  })
  product_sku: number;

  @Column({
    nullable: true,
  })
  amount: number;

  @Column({
    nullable: true,
  })
  product_name: string;

  @Column({
    nullable: true,
  })
  english_product_name: string;

  @Column({
    nullable: true,
  })
  price: number;

  @Column({
    nullable: true,
  })
  material: string;

  @Column({
    nullable: true,
  })
  customs_code: string;

  @Column({
    nullable: true,
  })
  fnscu: string;

  @Column({
    nullable: true,
  })
  custome_picture: string;

  @Column({
    nullable: true,
  })
  operator_picture: string;

  @Column({
    nullable: true,
  })
  storage_plan_id: number;

  @Column({
    nullable: true,
    type: 'varchar'
  })
  order_transfer_number: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

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
