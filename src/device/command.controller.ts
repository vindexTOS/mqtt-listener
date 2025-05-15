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
import { ResetDeviceDto } from './dto/commands.dto';

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
}
