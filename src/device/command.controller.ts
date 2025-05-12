import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MqttHandlersProviders } from 'src/mqtt-handlers/mqtt-handlers.provider';
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
  

@Controller('commands')
export class CommandController {
  constructor( private readonly mqttHandlerProvider:MqttHandlersProviders) { }


//   @Post("sendCommand")
//   async sendMessage(){
//      return await this.commandService.sendCommandToDevice("4324442", )
//   }



  
}
