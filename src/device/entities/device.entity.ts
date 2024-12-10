import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
 import { DeviceSettings } from './device-settings.entity';
import { DeviceMessages } from './device-messages.entity';
 
  
  @Entity()
  export class Device {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: String, unique: true })
    dev_id: string;
    @Column({ type: String, nullable:true })
    name: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: Date , nullable:true})
    last_beat: Date;
  
    @OneToOne(() => DeviceSettings, (settings) => settings.device, { cascade: true })
    @JoinColumn()
    settings: Promise<DeviceSettings>;
  
    @OneToOne(() => DeviceMessages, (messages) => messages.device, { cascade: true })
    @JoinColumn()
    messages: DeviceMessages;
  
  }
  