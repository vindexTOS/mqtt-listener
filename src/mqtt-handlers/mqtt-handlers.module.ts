import { Module } from '@nestjs/common';
import { MqttHandlersService } from './mqtt-handlers.service';
import { MqttHandlersProviders } from './mqtt-handlers.provider';
 
@Module({
  imports:[ ],
  providers: [MqttHandlersService, MqttHandlersProviders  ],
  exports: [MqttHandlersService, MqttHandlersProviders],
})
export class MqttHandlersModule {}
