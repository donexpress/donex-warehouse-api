import { IsEmail, IsOptional } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
  user_id: number;
  
  @Column({
    type: "integer",
    nullable: true,
  })
  @IsOptional()
  output_plan_id

  @Column({
    type: "integer",
    nullable: true,
  })
  @IsOptional()
  operation_instruction_id

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
    type: "boolean",
    nullable: true,
    default: false
  })

  deleted: boolean;

  @Column({
    type: 'json',
    nullable: true,
    default: [],
  })
  meta: object[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
