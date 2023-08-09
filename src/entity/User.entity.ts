import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { UserState } from "./UserState.entity"
import { Department } from "./Department.entity"
import { Affiliation } from "./Affiliation.entity"
import { Role } from "./Role.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    username: string

    @Column({
        nullable: false
    })
    chinesse_name: string

    @Column({
        nullable: true,
        default: null
    })
    english_name: string

    @Column({
        nullable: false
    })
    password: string

    @Column({
        nullable: true,
        default: null
    })
    email: string

    @Column({
        nullable: true,
        default: null
    })
    phone: string

    @Column({
        nullable: true,
        default: null
    })
    observations: string

    @ManyToOne(() => UserState, (userState) => userState.users)
    state: UserState

    @ManyToOne(() => Department, (department) => department.users)
    department: Department

    @ManyToMany(()=> Affiliation, (affiliation) => affiliation.users)
    @JoinTable()
    affiliations: Affiliation[]

    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}