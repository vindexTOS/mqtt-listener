// dto/reset-device.dto.ts
import { IsEnum, IsString, IsInt, Min, Max  } from 'class-validator';

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

export class CreateAppConfigDto {
  @IsInt()
  @Min(0)
  @Max(1)
  startup: number; // Always 0

  @IsInt()
  @Min(1)
  @Max(30000) // 300 Lari = 30,000 Tetri
  paymentLimit: number; // In Tetri

  @IsInt()
  @Min(1)
  @Max(5000) // 50 Lari = 5,000 Tetri
  fineAmountPerMinute: number;

  @IsInt()
  @Min(1000)
  @Max(300000)
  doorAutoCloseTime: number; // In milliseconds

  @IsInt()
  @Min(1000)
  @Max(300000)
  menuTimeoutMs: number; // In milliseconds
}

export class CreateAppExt1ConfigDto {
  @IsInt()
  @Min(0)
  @Max(1)
  uiMode: number;

  @IsInt()
  @Min(0)
  @Max(5)
  retryCount: number;

  @IsInt()
  @Min(0)
  @Max(255)
  ledBrightness: number;

  @IsInt()
  @Min(100)
  @Max(60000)
  inactivityReset: number; // In ms
}