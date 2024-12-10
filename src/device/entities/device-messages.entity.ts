import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String,default:"daaweqi Rilaks", nullable: true })
  guest_msg_L1: string;

  @Column({ type: String,default:"stumris reJimi" ,nullable: true })
  guest_msg_L2: string;

  @Column({ type: String,default:"aqtiuria", nullable: true })
  guest_msg_L3: string;

  @Column({ type: String,default:"gadaxdilia" ,nullable: true })
  validity_msg_L1: string;

  @Column({ type: String,default:"daaweqi Rilaks" ,nullable: true })
  validity_msg_L2: string;
 

  @Column({ type: String, nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Device, (device) => device.messages)
  @JoinColumn({ name: 'device_id' }) 
  device: Device;
}
