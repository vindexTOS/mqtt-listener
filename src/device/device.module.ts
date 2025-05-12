import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MqttHandlersModule } from 'src/mqtt-handlers/mqtt-handlers.module';
import { CommandController } from './command.controller';
 

@Module({
  imports:[MqttHandlersModule],
  controllers: [DeviceController, CommandController],
  providers: [DeviceService],
})
export class DeviceModule {}
