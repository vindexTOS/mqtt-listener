import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity({ name: 'device_error_logs' })
export class DeviceErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  error_code: number;

  @Column({ type: 'varchar', length: 255 })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Device, device => device.error_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column()
  device_id: string;  
}
