import { Entity,PrimaryColumn, OneToOne, JoinTable, Index } from "typeorm"
import { Staff } from "./staff.model"
import { Warehouse } from './warehouse.model'

@Index(['staff_id'])
@Entity({ name: 'staff_warehouses_warehouse' })
export class StaffWarehouse {
    @PrimaryColumn()
    staff_id: number

    @PrimaryColumn()
    warehouse_id: string

    @OneToOne(() => Staff)
    @JoinTable() 
    staff: Staff
    
    @OneToOne(() => Warehouse)
    @JoinTable() 
    warehouses: Warehouse
}