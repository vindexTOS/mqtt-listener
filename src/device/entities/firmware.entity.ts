import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'firmware_versions' })
export class FirmwareVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  version: string;

  @Column({ type: 'varchar', length: 255 })
  file_url: string;

  @Column({ type: Number, name: 'crc32' })
  crc32: number;

  @Column({ type: Number })
  fileLength: number; // e.g. "56FAD512"

  // @Column({ type: 'varchar', length: 10, nullable: true })
  // device_type: string;

  @CreateDateColumn()
  created_at: Date;
}
