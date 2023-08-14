import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Index,
    JoinColumn,
  } from "typeorm";
  import { UserLevel } from "./user_level.model";
  
  @Index(["name"])
  @Entity({ name: "services" })
  export class Service {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
    
    @OneToMany((type) => UserLevel, (user_level) => user_level.services)
    @JoinColumn({ referencedColumnName: "service_id " })
    userLevels: UserLevel[];
  }
  