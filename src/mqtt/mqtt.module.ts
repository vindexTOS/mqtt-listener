import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttProvider } from './mqtt.provider';

@Module({
  controllers: [MqttController],
  providers: [  MqttService, MqttProvider],
})
export class MqttModule {}
