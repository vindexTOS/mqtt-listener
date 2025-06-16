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
  @Column({ type: Number, default: 0 })
  device_type: number;
  
  @Column({ type: String, default: '100' })
  soft_version: string;

  @Column({ type: String, default: '02A', nullable: true })
  hardware_version: string;

  @Column({ type: Number, default: 2, nullable: true })
  network: number;
  @Column({ type: Number, default: 2, nullable: true })
  networkType: number;
  @Column({ type: String, default: "", nullable: true })
  ssid: string;
  @Column({ type: String, default: "", nullable: true })
   wifiPassword: string;

 


 
  @Column({ type: Number, default:30000, nullable: true })
  paymentLimit: number;

  @Column({ type: Number, default:5000, nullable: true })
  fineAmountPerMinute: number;

// miliseconds
  @Column({ type: Number, default:1000, nullable: true })
  doorAutoCloseTimeMs: number;

// miliseconds
  @Column({ type: Number, default:1000, nullable: true })
  menuTimeoutMs: number;

 

 

 

 
  @Column()
  device_id: number; 

  @Column({ type: Number, default: 0, nullable: true }) 
  service1Time:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service2Time:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service3Time:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service4Time:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service1Amount:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service2Amount:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service3Amount:number
  @Column({ type: Number, default: 0, nullable: true }) 
  service4Amount:number
  @Column({ type: Number, default: 0, nullable: true }) 
  overTimeAmountPerMinute:number

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
  device: Device;
}
