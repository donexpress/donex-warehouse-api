import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    JoinColumn,
  } from "typeorm";
import { User } from "./user.model";
  
  @Index(["name"])
  @Entity({ name: "payment_methods" })
  export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    code: string;
  
    @Column()
    name: string;
  
    @OneToMany((type) => User, (user) => user.states)
    @JoinColumn({ referencedColumnName: "payment_method_id " })
    users: User[];
  }
  