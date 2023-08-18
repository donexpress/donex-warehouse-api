import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['name'])
@Entity({ name: 'shelf_billing_types' })
export class ShelfBillingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];
}
