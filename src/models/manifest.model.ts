import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { ShipperAddress } from './shipper_address.model';
import { ConsigneeAddress } from './consignee_address.model';

@Index([
  'waybill_id',
  'tracking_number',
  'updated_at',
  'client_reference',
  'carrier',
])
@Entity({ name: 'manifests' })
export class Manifest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  waybill_id: string;

  @Column({
    type: 'varchar',
  })
  bag_code: string;

  @Column({
    type: 'varchar',
  })
  bag_id: string;

  @Column({
    type: 'varchar',
  })
  tracking_number: string;

  @Column({
    type: 'varchar',
  })
  client_reference: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  manifest_name: string;

  @Column({
    type: 'varchar',
  })
  weigth: string;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  @IsPositive()
  unit_weigth: number;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  @IsPositive()
  total_declare: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  currency: string;

  @Column({
    type: 'varchar',
  })
  item_title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  item_description: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsPositive()
  quantity: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  pieces: number;

  @Column({
    type: 'float',
    nullable: true,
    default: 0,
  })
  shipping_cost: number;

  @Column({
    type: 'float',
    nullable: true,
    default: 0,
  })
  sale_price: number;

  @Column({
    type: 'float',
    nullable: true,
    default: 0,
  })
  invoice_weight: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  state: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  paid: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  payment_voucher: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  bill_state: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  carrier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    (type) => ShipperAddress,
    (shipperAddress) => shipperAddress.manifest_id,
    {
      nullable: true,
      cascade: true
    }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'manifest_id' })
  shipper_address: ShipperAddress;

  @OneToOne(
    (type) => ConsigneeAddress,
    (consigneeAddress) => consigneeAddress.manifest_id,
    {
      nullable: true,
      cascade: true
    }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'manifest_id' })
  consignee_address: ConsigneeAddress;
}
