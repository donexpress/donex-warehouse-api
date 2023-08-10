import { Entity,PrimaryColumn, OneToOne, JoinTable } from "typeorm"
import { User } from "./user.model"
import { Affiliation } from './affiliation.model'

@Entity()
export class UserState {
    @PrimaryColumn()
    userId: number

    @PrimaryColumn()
    affiliationId: string

    @OneToOne(() => User)
    @JoinTable() 
    users: User
    
    @OneToOne(() => Affiliation)
    @JoinTable() 
    affiliation: Affiliation
}