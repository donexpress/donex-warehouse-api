import { IsNumber, Min } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index(['id', 'shelf_id'])
@Entity({ name: 'shelf_packages' })
export class ShelfPackages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  shelf_id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  package_id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  layer: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @IsNumber()
  column: number;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  created_at: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: new Date().toISOString(),
  })
  updated_at: string;
}
