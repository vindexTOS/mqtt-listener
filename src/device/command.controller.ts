import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StorageResetOptions } from 'src/mqtt-handlers/mqtt-handler.messages';
import { MqttHandlersProviders } from 'src/mqtt-handlers/mqtt-handlers.provider';
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
import { ResetDeviceDto, UpdateFirmwareDto } from './dto/commands.dto';
 
 import * as dotenv from 'dotenv';

dotenv.config()
@Controller('commands')
export class CommandController {
  constructor(private readonly mqttHandlerProvider: MqttHandlersProviders) {}

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
}
