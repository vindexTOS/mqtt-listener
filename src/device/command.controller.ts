import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StorageResetOptions } from 'src/mqtt-handlers/mqtt-handler.messages';
import { MqttHandlersProviders } from 'src/mqtt-handlers/mqtt-handlers.provider';
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
import { CreateAppConfigDto, CreateAppExt1ConfigDto, ResetDeviceDto, UpdateFirmwareDto } from './dto/commands.dto';
 
 import * as dotenv from 'dotenv';
import { DeviceSettings } from './entities/device-settings.entity';
import { EntityManager } from 'typeorm';
import { Device } from './entities/device.entity';

dotenv.config()
@Controller('commands')
export class CommandController {
  constructor(private readonly mqttHandlerProvider: MqttHandlersProviders ,  private readonly entetieManager:EntityManager) {}

  //   @Post("sendCommand")
  //   async sendMessage(){
  //      return await this.commandService.sendCommandToDevice("4324442", )
  //   }

  @Get('reset-command-options')
  async sendResetCommandOptions() {
    return StorageResetOptions;
  }

  @Post("reset-device")
  async resetDevice(@Body() body:ResetDeviceDto ){
    const {resetSection,dev_id } = body
    return await this.mqttHandlerProvider.handlePublishMessage("ResetStorage" , dev_id, String(resetSection) )
  }

  @Post("update-firmware")
  async updateFirmware(@Body() body:UpdateFirmwareDto){
    const {version, dev_id , crc32} = body 

    // const url = `${process.env.BASE_URL || "http://localhost:3000"}/download-fota/download/${version}`
    const url = `${  "http://localhost:3000"}/download-fota/download/${version}`
    return await this.mqttHandlerProvider.handlePublishMessage("UpdateFirmware", dev_id,{ url, version, crc32 }  )
    
  }



@Post('send-appconfig-t/:dev_id')
async sendAppConfig(
  @Param('dev_id') dev_id: string,
  @Body() dto: CreateAppConfigDto,
) {

  const device = await this.entetieManager.findOne(Device, {where:{dev_id}})
  if(!device){
    throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
  }

  await this.entetieManager.update(DeviceSettings, {device},   dto );
      
  return await this.mqttHandlerProvider.handlePublishMessage("SendAppConfig", dev_id, dto   )
}

@Post('send-appext1config/:dev_id')
async sendAppExtConfig(
  @Param('dev_id') dev_id: string,
  @Body() dto: CreateAppExt1ConfigDto,
) {

  const device = await this.entetieManager.findOne(Device, {where:{dev_id}})
  if(!device){
    throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
  }
    await this.entetieManager.update(DeviceSettings, {device},   dto );

  return await this.mqttHandlerProvider.handlePublishMessage("SendAppConfig", dev_id, dto   )
}
}
