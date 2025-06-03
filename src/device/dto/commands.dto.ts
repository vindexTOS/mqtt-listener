// dto/reset-device.dto.ts
import { Type } from 'class-transformer';
import { IsEnum, IsString, IsInt, Min, Max, ValidateNested, ArrayMinSize, ArrayMaxSize, IsArray, Length  } from 'class-validator';

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

export class ServiceConfig {
  @IsInt()
  @Min(1)
  @Max(86400)  
  time: number 

  @IsInt()
  @Min(1)
  @Max(50000)  
  amount: number;  
}
export class CreateAppConfigDto {
  @IsInt()
  @Min(0)
  @Max(1)
  startup: number;  

  @IsInt()
  @Min(1)
  @Max(30000)
  paymentLimit: number;  

  @IsInt()
  @Min(1)
  @Max(5000)
  fineAmountPerMinute: number;  

  @IsInt()
  @Min(1000)
  @Max(300000)
  doorAutoCloseTimeMs: number; 

  @IsInt()
  @Min(1000)
  @Max(300000)
  menuTimeoutMs: number;  

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceConfig)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  services: ServiceConfig[];

  @IsInt()
  @Min(1)
  @Max(5000)
  overTimeAmountPerMinute: number; // In Tetri
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
    @IsInt()
  @Min(0)
  @Max(1)
  startup: number; // Always 0

  @IsInt()
  @Min(0)
  @Max(1)
  networkType: number; // 0 = cellular, 1 = WiFi

  @IsString()
  @Length(0, 128)
  ssid: string; // Null-terminated string, max 128 bytes

  @IsString()
  @Length(0, 128)
  password: string; // Null-terminated string, max 128 bytes
}

 

export class ResetLockerPasswordDto {
  @IsInt()
  @Min(1)
  @Max(6)
  lockerId: number;

  @IsString()
  @Length(4, 4)
  code: string;
}
export class OpenDoorDto {
  @IsInt()
  @Min(1)
  @Max(6)
  lockerId: number;

 @IsInt()
  @Min(0)
  @Max(1)
  openClose: number;
}
