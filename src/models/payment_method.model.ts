import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.model';
import { IsOptional } from 'class-validator';

@Index(['name'])
@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;
}
