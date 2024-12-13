import { Controller } from '@nestjs/common';
 
import { MicroservicesService } from './microservices.service';
 
import { OnEvent } from '@nestjs/event-emitter';
import { MqttPayload } from 'src/mqtt/mqtt.interface';

@Controller()
export class MicroservicesController {
  constructor(private readonly microservicesService: MicroservicesService) {}

  @OnEvent("heartbeat")
 async handleHeartbeatEvent(data: MqttPayload) {
  return await this.microservicesService.heartBeatHandler(data)

}


 
}
