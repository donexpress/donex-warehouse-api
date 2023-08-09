import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./User.entity"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column()
    display_name: string

    @OneToMany(() => User, (user) => user.role) // note: we will create author property in the Photo class below
    users: User[]
}