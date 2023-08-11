import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Staff } from "./staff.model"

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

    @OneToMany(() => Staff, (staff) => staff.departaments)
    staff: Staff[]
}