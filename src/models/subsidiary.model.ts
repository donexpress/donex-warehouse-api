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
@Entity({ name: "subsidiaries" })
export class Subsidiary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany((type) => User, (user) => user.subsidiaries)
    @JoinColumn({ referencedColumnName: "subsidiary_id " })
    users: User[];

}
