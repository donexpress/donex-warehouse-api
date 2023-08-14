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
@Entity({ name: "user_states" })
export class UserState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany((type) => User, (user) => user.states)
    @JoinColumn({ referencedColumnName: "state_id " })
    users: User[];

}
