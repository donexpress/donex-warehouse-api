import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Affiliation } from "./Affiliation.entity"

@Entity()
export class AffiliationState {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Affiliation, (affiliation) => affiliation.state) // note: we will create author property in the Photo class below
    afilliations: Affiliation[]
}