import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
  } from "typeorm";
  
  @Index(["name"])
  @Entity({ name: "payment_methods" })
  export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    code: string;
  
    @Column()
    name: string;
  
  }
  