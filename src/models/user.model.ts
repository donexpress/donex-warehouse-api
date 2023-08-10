import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { UserState } from "./userState.model"
import { Departament } from "./departament.model"
import { Affiliation } from "./affiliation.model"
import { Role } from "./role.model"

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

    @Column()
    stateId: number

    @Column()
    departamentId: number

    @Column()
    roleId: number

    @ManyToOne(() => UserState, (userState) => userState.users)
    state: UserState

    @ManyToOne(() => Departament, (department) => department.users)
    departament: Departament

    @ManyToMany(()=> Affiliation, (affiliation) => affiliation.users)
    @JoinTable()
    affiliations: Affiliation[]

    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}