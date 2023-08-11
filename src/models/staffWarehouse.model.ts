import { Entity,PrimaryColumn, OneToOne, JoinTable, Index } from "typeorm"
import { Staff } from "./staff.model"
import { Warehouse } from './warehouse.model'

@Index(['staffId'])
@Entity({ name: 'staff_warehouses_warehouse' })
export class StaffWarehouse {
    @PrimaryColumn()
    staffId: number

    @PrimaryColumn()
    warehouseId: string

    @OneToOne(() => Staff)
    @JoinTable() 
    staff: Staff
    
    @OneToOne(() => Warehouse)
    @JoinTable() 
    warehouses: Warehouse
}