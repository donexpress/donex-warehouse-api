import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./User.entity"

@Entity()
export class UserState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => User, (user) => user.state) // note: we will create author property in the Photo class below
    users: User[]
}