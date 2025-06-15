import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { MqttHandlersModule } from 'src/mqtt-handlers/mqtt-handlers.module';
import { CommandController } from './command.controller';
import { EarningsService } from './earnings/earnings.service';
import { EarningsController } from './earnings/earnings.controller';
 

@Module({
  imports:[MqttHandlersModule],
  controllers: [DeviceController, CommandController, EarningsController],
  providers: [DeviceService, EarningsService],
})
export class DeviceModule {}
