import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceEarning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number, unique: false })
  device_id: number;
  @Column({ type: Number, nullable: true, default: 0 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Device, (device) => device.device_earnings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
