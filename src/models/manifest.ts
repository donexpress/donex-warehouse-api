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
import { IsOptional, IsPositive } from 'class-validator';
import { SenderAddress } from './sender_address';
import { ReseiverAddress } from "./receiver_address";

@Index(['order_id', 'tracking_number', 'state'])
@Entity({ name: 'manifests' })
export class Manifest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  manifest_name: string;

  @Column({
    type: 'varchar'
  })
  order_id: string;

  @Column({
    type: 'varchar'
  })
  tracking_number: string;

  @Column({
    type: 'integer'
  })
  @IsPositive()
  quantity: number;

  @Column({
    type: 'integer'
  })
  @IsPositive()
  weigth: number;

  @Column({
    type: 'integer'
  })
  @IsPositive()
  pieces: number;

  @Column({
    type: 'varchar'
  })
  item_title: string;

  @Column({
    type: 'varchar'
  })
  item_description: string;

  @Column({
    type: 'integer'
  })
  @IsPositive()
  shipping_cost: number;

  @Column({
    type: 'integer'
  })
  @IsPositive()
  sale_price: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
  currency: string;

  @Column({
    type: 'varchar'
  })
  state: string;

  @Column({
    type: 'varchar'
  })
  bill_state: string;

  @Column({
    type: 'varchar'
  })
  receiver_country: string;

  @Column({
    type: 'boolean',
    default: false
  })
  paid: boolean;

  @Column({
    type: 'varchar'
  })
  payment_voucher: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(type => SenderAddress, senderAddress => senderAddress.manifest_id, {
    nullable: true
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'manifest_id' })
  senderAddress: SenderAddress;

  @OneToOne(type => ReseiverAddress, reseiverAddress => reseiverAddress.manifest_id, {
    nullable: true
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'manifest_id' })
  reseiverAddress: ReseiverAddress;

}
