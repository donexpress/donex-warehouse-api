import { IsEmail, IsOptional } from "class-validator";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(["id", "user_id"])
@Entity({ name: "appendages" })
export class Appendix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true
  })
  name: string;

  @Column({
    type: "integer",
    nullable: true,
  })
  @IsOptional()
  user_id: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  @IsOptional()
  function: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  @IsOptional()
  url: string;

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
