import { Module } from '@nestjs/common';
 
import { MqttService } from './mqtt.service';
import { MqttProvider } from './mqtt.provider';
 
import { EventEmitterModule } from '@nestjs/event-emitter';
  
@Module({
  imports:[         EventEmitterModule.forRoot(),  ],
  controllers: [ ],
  providers: [  MqttService, MqttProvider ],
})
export class MqttModule {}
