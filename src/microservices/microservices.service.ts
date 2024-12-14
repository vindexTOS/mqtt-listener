import { Injectable, Logger } from '@nestjs/common';
import { DeviceSettings } from 'src/device/entities/device-settings.entity';
import { Device } from 'src/device/entities/device.entity';
import { MqttPayload } from 'src/mqtt/mqtt.interface';
import { EntityManager } from 'typeorm';
import * as moment from 'moment-timezone';
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
@Injectable()
export class MicroservicesService {
    constructor(private readonly entityManager: EntityManager,private readonly mqttHandlerService:MqttHandlersService) { }
    private readonly logger = new Logger(MicroservicesService.name);

    async heartBeatHandler(data: MqttPayload): Promise<any> {
       return this.mqttHandlerService.heartBeatHandler(data)
    }

    async generalEventHandler(data:MqttPayload){
         return this.mqttHandlerService.generalEventHandler(data)
    }
}
