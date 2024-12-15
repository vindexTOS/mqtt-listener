import { Injectable  } from '@nestjs/common';
 
 
 
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
import { MqttPayload } from 'src/mqtt/mqtt.provider';
@Injectable()
export class MicroservicesService {
    constructor( private readonly mqttHandlerService:MqttHandlersService) { }
 
    async heartBeatHandler(data: MqttPayload): Promise<any> {
       return this.mqttHandlerService.heartBeatHandler(data)
    }

    async generalEventHandler(data:MqttPayload){
         return this.mqttHandlerService.generalEventHandler(data)
    }
}
