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
@Entity({ name: "regional_divisions" })
export class RegionalDivision {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany((type) => User, (user) => user.regional_divisions)
    @JoinColumn({ referencedColumnName: "regional_division_id " })
    users: User[];

}
