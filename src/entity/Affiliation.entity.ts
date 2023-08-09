import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm"
import { AffiliationState } from "./AffiliationState.entity"
import { User } from "./User.entity"

@Entity()
export class Affiliation {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    name: string

    @Column({
        nullable: false
    })
    english_name: string

    @Column({
        nullable: false
    })
    receiving_area: string

    @Column({
        nullable: false
    })
    principal: string

    @Column()
    contact_phone: string

    @Column()
    address: string

    @Column()
    city: string
    
    @Column()
    province: string

    @Column()
    country: string

    @Column()
    cp: string

    @Column()
    shared_warehouse_system_code: string

    @Column()
    shared_warehouse_docking_code: string

    @Column()
    customer_order_number_rules: string

    @ManyToOne(() => AffiliationState, (affiliationState) => affiliationState.afilliations)
    state: AffiliationState

    @ManyToMany(()=> User, (user) => user.affiliations)
    users: User[]
}