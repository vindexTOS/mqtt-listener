import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'firmware_versions' })
export class FirmwareVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  version: string;  

  @Column({ type: 'varchar', length: 255 })
  file_url: string; 

  @Column({ type: 'varchar', length: 8 })
  crc32: string; // e.g. "56FAD512"

  // @Column({ type: 'varchar', length: 10, nullable: true })
  // device_type: string;  

  @CreateDateColumn()
  created_at: Date;
}
