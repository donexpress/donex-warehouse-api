import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { UserState } from "./userState.model";
import { Staff } from "./staff.model";
import { Subsidiary } from "./subsidiary.model";
import { RegionalDivision } from "./regionalDivision.model";
import { Warehouse } from "./warehouse.model";
import { UserLevel } from "./user_level.model";
import { PaymentMethod } from "./paymentMethod.model";

@Index(["username"])
@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    nickname: string;

    @Column()
    label_code: string;

    @Column()
    password: string;

    @Column()
    contact: string;

    @Column()
    company: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    qq: string;

    @Column()
    credits: string
    
    @Column()
    observations: string
    
    @Column()
    state_id: number

    @Column()
    finantial_representative: number

    @Column()
    client_service_representative: number

    @Column()
    sales_representative: number

    @Column()
    sales_source: number

    @Column()
    subsidiary_id: number

    @Column()
    regional_division_id: number

    @Column()
    warehouse_id: number

    @Column()
    shipping_control: boolean
    
    @Column()
    hidde_transfer_order: boolean
    
    @Column()
    reset_password: boolean

    @Column()
    user_level_id: number

    @Column()
    payment_method_id: number
    

    @ManyToOne((type) => UserState, (state) => state.users)
    @JoinColumn({ name: "state_id", referencedColumnName: "id" })
    states: UserState;

    @ManyToOne((type) => Staff, (staff) => staff.finantial_representatives)
    @JoinColumn({ name: "finantial_representative", referencedColumnName: "id" })
    finantial_representatives: Staff;

    @ManyToOne((type) => Staff, (staff) => staff.client_service_representative)
    @JoinColumn({ name: "client_service_representative", referencedColumnName: "id" })
    client_service_representatives: Staff;

    @ManyToOne((type) => Staff, (staff) => staff.sales_representatives)
    @JoinColumn({ name: "sales_representative", referencedColumnName: "id" })
    sales_representatives: Staff;

    @ManyToOne((type) => Staff, (staff) => staff.sales_sources)
    @JoinColumn({ name: "sales_source", referencedColumnName: "id" })
    sales_sources: Staff;

    @ManyToOne((type) => Subsidiary, (subsidiary) => subsidiary.users)
    @JoinColumn({ name: "subsidiary_id", referencedColumnName: "id" })
    subsidiaries: Subsidiary;

    @ManyToOne((type) => RegionalDivision, (regionalDivision) => regionalDivision.users)
    @JoinColumn({ name: "regional_division_id", referencedColumnName: "id" })
    regional_divisions: RegionalDivision;

    @ManyToOne((type) => Warehouse, (warehouse) => warehouse.users)
    @JoinColumn({ name: "warehouse_id", referencedColumnName: "id" })
    warehouses: RegionalDivision;

    @ManyToOne((type) => UserLevel, (user_level) => user_level.users)
    @JoinColumn({ name: "user_level_id", referencedColumnName: "id" })
    user_level: UserLevel;

    @ManyToOne((type) => PaymentMethod, (payment_method) => payment_method.users)
    @JoinColumn({ name: "payment_method_id", referencedColumnName: "id" })
    payment_methods: PaymentMethod;

}
