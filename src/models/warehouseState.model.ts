import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Warehouse } from "./warehouse.model"

@Index(['name'])
@Entity({ name: 'warehouses_states' })
export class WarehouseState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Warehouse, (warehouse) => warehouse.state) 
    warehouses: Warehouse[]
}