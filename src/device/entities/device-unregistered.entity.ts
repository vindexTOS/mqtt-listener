import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
 
  } from 'typeorm';
 
 
  
  @Entity()
  export class UnregisteredDevice {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: String, unique: true })
    dev_id: string;
    @Column({ type: String, nullable:true })
    soft_version: string;
  
    @Column({ type: String, nullable:true })
    hardware_version: string;
  
  }
  