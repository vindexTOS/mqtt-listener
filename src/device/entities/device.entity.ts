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
import { DeviceErrorLog } from './device-errors.entity';
import { DeviceEarning } from './device-earnings.entity';
import { DeviceLockers } from './device-lockers.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

@Column({ type: String, unique: true })
  dev_id: string;
@Column({ type: String,   unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: Date, nullable: true })
  last_beat: Date;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @OneToOne(() => DeviceSettings, (settings) => settings.device, {
    cascade: true,
  })

  
  @JoinColumn()
  settings: DeviceSettings;

  @OneToOne(() => DeviceMessages, (messages) => messages.device, {
    cascade: true,
  })
  @JoinColumn()
  messages: DeviceMessages;

  @OneToMany(() => DeviceErrorLog, (errorLog) => errorLog.device)
  error_logs: DeviceErrorLog[];
  @OneToMany(() => DeviceEarning, (device_earnings) => device_earnings.device)
  device_earnings: DeviceEarning[];
  @OneToMany(() => DeviceLockers, (lockers) => lockers.device)
  lockers: DeviceLockers[];



}
