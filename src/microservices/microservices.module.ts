import { Module } from '@nestjs/common';
import { MicroservicesService } from './microservices.service';
import { MicroservicesController } from './microservices.controller';
import { MqttHandlersModule } from 'src/mqtt-handlers/mqtt-handlers.module';

@Module({
  imports:[MqttHandlersModule],
  controllers: [MicroservicesController],
  providers: [MicroservicesService],
})
export class MicroservicesModule {}
