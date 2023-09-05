import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsOptional } from 'class-validator';

@Index(['name'])
@Entity({ name: 'line_classifications' })
export class LineClassification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsOptional()
  channels: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsOptional()
  billing_account: number;

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
