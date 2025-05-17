import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceEarning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  device_id: string;
  @Column({ type: String, nullable: true })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;
}
