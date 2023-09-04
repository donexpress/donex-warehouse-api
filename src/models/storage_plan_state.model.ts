import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['name',])
@Entity({ name: 'storage_plan_states' })
export class StoragePlanState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toDateString()
  })
  created_at: string

  @Column({
    type: 'varchar',
    nullable: true,
    default: (new Date()).toDateString()
  })
  updated_at: string
}
