import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Device } from './device.entity';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
enum AlarmEnum {
    "No Alarm" = 0 ,
    "Tilted Sensor" = 1,
    "Door Sensor" = 2 ,
    "Battery Low Voltage" = 4,
    "Battery Extremely Low (Shutdown)" = 8 
}
@Entity()
export class DeviceSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Boolean, default: false, nullable: true })
  Lockerstatus: Boolean;

  @Column({ type: Boolean, default: false, nullable: true })
  IsCharging: Boolean;

  @Column({ type: Boolean, default: false, nullable: true })
  IsOpen: Boolean;

  @Column({ type: Number, default: 0, nullable: true })
  PaymentOptions: number;


  @Column({ type:Boolean, default:false})
  alarm_tilt_sensor:boolean

  @Column({ type:Boolean, default:false })
  alarm_door_sensor:boolean

  @Column({ type:Boolean, default:false })
  alarm_battery_low_voltage:boolean

  @Column({ type:Boolean, default:false })
  alarm_battery_extremaly_low_voltage:boolean

  
  @Column({ type: String, default: '100' })
  soft_version: string;

  @Column({ type: String, default: '02A', nullable: true })
  hardware_version: string;

  @Column({ type: Number, default: 2, nullable: true })
  network: number;

  @Column({ type: Number, default: 0, nullable: true })
  signal: number;

  @Column({ type: Number, default: 0, nullable: true })
  sim_card_number: number;
  @Column({ type: Number, default: 0, nullable: true })
  isBlocked: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Device, (device) => device.settings)
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
