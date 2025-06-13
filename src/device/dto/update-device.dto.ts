import { IsString, IsNumber,    IsIn,    Max, Min } from 'class-validator';

export class UpdateDeviceDto {
    @IsString()
    readonly dev_id: string;  
      @IsString() 
      readonly name:string 
     
   
  }
  
