import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceLockers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  lockerId: number;

  @Column({ type: 'int' })
  device_id: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  lockerStatus: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isCharging: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isOpen: boolean;
  @Column({ type: String  ,nullable: true })
  code: string;

  @Column({ type: 'int', default: 0, nullable: true })
  paymentOptions: number;

  @ManyToOne(() => Device, (device) => device.lockers, {
   onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
