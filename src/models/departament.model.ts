import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./user.model"

@Entity()
export class Departament {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    parent_organization: string

    @Column()
    organization_type: string

    @OneToMany(() => User, (user) => user.departament)
    users: User[]
}