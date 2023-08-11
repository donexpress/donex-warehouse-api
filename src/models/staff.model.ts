import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index } from "typeorm"
import { StaffState } from "./staffState.model"
import { Organization } from "./organization.model"
import { Warehouse } from "./warehouse.model"
import { Role } from "./role.model"

@Index(['username'])
@Entity()
export class Staff {
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
    organizationId: number

    @Column()
    roleId: number

    @ManyToOne(() => StaffState, (staffState) => staffState.staff)
    states: StaffState

    @ManyToOne(() => Organization, (organization) => organization.staff)
    organizations: Organization

    @ManyToMany(()=> Warehouse, (warehouse) => warehouse.staff)
    @JoinTable()
    warehouses: Warehouse[]

    @ManyToOne(() => Role, (role) => role.staff)
    roles: Role
}