import { IsEmail, IsOptional } from "class-validator";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(["code", "name"])
@Entity({ name: "aos_warehouses" })
export class AOSWarehouse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    code: string

    @Column({
        type: 'varchar',
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    contact: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    company: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    country: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    address_1: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    address_2: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    city: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    province: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    cp: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    phone: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    @IsEmail()
    email: string

    @Column({
        type: 'varchar',
        nullable: true
    })
    @IsOptional()
    observations: string
}
