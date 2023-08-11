import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Staff } from "./staff.model"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Staff, (staff) => staff.roles) 
    staff: Staff[]
}