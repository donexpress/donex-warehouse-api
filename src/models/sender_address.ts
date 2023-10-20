import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Manifest } from './manifest';

@Entity({ name: 'sender_addreses' })
export class SenderAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false
  })
  @IsInt()
  @Min(1)
  manifest_id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name_receiver: string;

  @Column({
    type: 'varchar',
  })
  tax_id: string;

  @Column({
    type: 'varchar',
  })
  address1: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  address2: string;

  @Column({
    type: 'varchar',
  })
  city: string;

  @Column({
    type: 'varchar',
  })
  state: string;

  @Column({
    type: 'varchar',
  })
  country: string;

  @Column({
    type: 'varchar',
  })
  code_zip: string;

  @Column({
    type: 'varchar',
  })
  phone_number: string;

  @Column({
    type: 'varchar',
  })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne((type) => Manifest, (manifest) => manifest.id, {
    nullable: true,
  })
  manifest: Manifest;
}
