import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Warehouse } from "./warehouse.model"

@Entity()
export class WarehouseState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Warehouse, (warehouse) => warehouse.state) 
    warehouses: Warehouse[]
}