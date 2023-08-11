import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Staff } from "./staff.model"

@Entity()
export class StaffState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Staff, (staff) => staff.states) 
    staff: Staff[]
}