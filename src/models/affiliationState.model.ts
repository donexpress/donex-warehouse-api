import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Affiliation } from "./affiliation.model"

@Entity()
export class AffiliationState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Affiliation, (affiliation) => affiliation.state) 
    afilliations: Affiliation[]
}