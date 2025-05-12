import { IsString } from 'class-validator';

export class CreateDeviceDto {
    @IsString()
    readonly dev_id: string;
    @IsString()
    readonly name: string
    // @IsString()
    // readonly password: string


}
