// dto/reset-device.dto.ts
import { IsEnum, IsString } from 'class-validator';

export enum StorageResetSection {
  AppConfig = 1,
  Extended1Config = 2,
  LockersConfig = 16,
  MqttConfig = 32,
  SystemConfig = 64,
  ResetAll = 255,
}

export type ResetType = 1 | 2 | 16 | 32 | 64 | 255;

export class ResetDeviceDto {
  @IsString()
  dev_id: string;

  @IsEnum(StorageResetSection, {
    message: `resetSection must be one of: ${Object.values(StorageResetSection).filter(v => typeof v === 'number').join(', ')}`,
  })
  resetSection: ResetType;
}



export class  UpdateFirmwareDto{
  @IsString()
   version:string 
   @IsString()
   dev_id: string;
   @IsString()
   crc32: string;
}