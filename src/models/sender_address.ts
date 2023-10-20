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
    nullable: true
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
    nullable: true,
  })
  tax_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address1: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  address2: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  state: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  country: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  code_zip: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone_number: string;

  @Column({
    type: 'varchar',
    nullable: true,
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
