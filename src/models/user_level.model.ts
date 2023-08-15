import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
  } from "typeorm";
  import { Service } from "./service.model";
import { User } from "./user.model";
  
  @Index(["name"])
  @Entity({ name: "user_levels" })
  export class UserLevel {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    observations: string;

    @Column()
    service_id: number;
    
    @ManyToOne((type) => Service, (role) => role.userLevels)
    @JoinColumn({ name: "service_id", referencedColumnName: "id" })
    services: Service;

    @OneToMany((type) => User, (user) => user.user_level)
    @JoinColumn({ referencedColumnName: "user_level_id" })
    users: User[];
  }
  