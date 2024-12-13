import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttProvider } from './mqtt.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventEmitterModule } from '@nestjs/event-emitter';
 
@Module({
  imports:[         EventEmitterModule.forRoot(),  ],
  controllers: [MqttController],
  providers: [  MqttService, MqttProvider],
})
export class MqttModule {}
