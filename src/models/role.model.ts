import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Staff } from "./staff.model"

@Index(['name'])
@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Staff, (staff) => staff.roles) 
    staff: Staff[]
}