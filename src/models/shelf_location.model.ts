import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
  } from 'typeorm';
  
  @Index(['name'])
  @Entity({ name: 'shelf_locations' })
  export class ShelfLocation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'varchar',
      nullable: false,
    })
    name: string;

    @Column({
        type: 'json',
        nullable: true,
    })
    meta: any
  
  }
  