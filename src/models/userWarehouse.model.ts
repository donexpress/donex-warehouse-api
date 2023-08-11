import { Entity,PrimaryColumn, OneToOne, JoinTable } from "typeorm"
import { Staff } from "./staff.model"
import { Warehouse } from './warehouse.model'

@Entity()
export class StaffState {
    @PrimaryColumn()
    userId: number

    @PrimaryColumn()
    affiliationId: string

    @OneToOne(() => Staff)
    @JoinTable() 
    staff: Staff
    
    @OneToOne(() => Warehouse)
    @JoinTable() 
    warehouses: Warehouse
}