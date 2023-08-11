import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Staff } from "./staff.model"

@Index(['name'])
@Entity({ name: 'staff_states' })
export class StaffState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Staff, (staff) => staff.states) 
    staff: Staff[]
}