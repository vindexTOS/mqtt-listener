import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Device } from './device.entity';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

@Entity()
export class DeviceSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number, default: 5, nullable: true })
  relay_pulse_time: number;

  @Column({ type: Number, default: 50, nullable: true })
  lcd_brightness: number;

  @Column({ type: Number, default: 50, nullable: true })
  led_brightness: number;

  @Column({ type: Number, default: 5, nullable: true })
  msg_appear_time: number;

  @Column({ type: Number, default: 5, nullable: true })
  card_read_delay: number;

  @Column({ type: Number, default: 0, nullable: true })
  storage_disable: 0 | 1;

  @Column({ type: Number, default: 0, nullable: true })
  relay1_node: 0 | 1;

  @Column({ type: Number, default: 0, nullable: true })
  op_mode: 0 | 1;

  @Column({ type: String, default: '100' })
  soft_version: string;

  @Column({ type: String, default: '02A', nullable: true })
  hardware_version: string;

  @Column({ type: Number, default: 5, nullable: true })
  limit: number;

  @Column({ type: Number, default: 2, nullable: true })
  network: number;

  @Column({ type: Number, default: 0, nullable: true })
  signal: number;

  @Column({ type: Number, default: 0, nullable: true })
  sim_card_number: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
 
  @OneToOne(() => Device, (device) => device.settings)
  @JoinColumn({ name: 'device_id' })
  device: Device ;  
}
