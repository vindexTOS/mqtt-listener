import { IsString, IsNumber,    IsIn,    Max, Min } from 'class-validator';

export class UpdateDeviceDto {
    @IsString()
    readonly dev_id: string;  
      @IsString() 
      readonly name:string 
    @IsNumber()
  @Min(1)
  @Max(10)
  readonly relay_pulse_time: number; 

  @IsNumber()
  @Min(0)
  @Max(100)
  readonly lcd_brightness: number;  

  @IsNumber()
  @Min(0)
  @Max(100)
  readonly led_brightness: number; 

  @IsNumber()
  @Min(1)
  @Max(10)
  readonly msg_appear_time: number;  

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsIn([0, 1])
  readonly storage_disable: 0 | 1;  

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsIn([0, 1])
  readonly relay1_node: 0 | 1;  

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsIn([0, 1])
  readonly op_mode: 0 | 1;  

  @IsString()
  readonly soft_version: string; 

  @IsString()
  readonly hardware_version: string; 

  @IsNumber()
  @Min(1)
  @Max(100)
  readonly limit: number;  

  @IsNumber()
  @Min(1)
  @Max(100)
  readonly network: number;  

  @IsNumber()
  @Min(0)
  @Max(100)
  readonly signal: number;  

   
  }
  
