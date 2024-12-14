import { Controller } from '@nestjs/common';

import { MicroservicesService } from './microservices.service';

import { OnEvent } from '@nestjs/event-emitter';
import { MqttPayload } from 'src/mqtt/mqtt.interface';

@Controller()
export class MicroservicesController {
  constructor(private readonly microservicesService: MicroservicesService) { }

  @OnEvent("heartBeatHandler")
  async handleHeartbeatEvent(data: MqttPayload) {
    await this.microservicesService.heartBeatHandler(data)

  }


  @OnEvent("generalEventHandler")
  async generalEventHandler(data: MqttPayload) {
    await this.microservicesService.generalEventHandler(data)

  }
}
