import { Injectable } from '@nestjs/common';
import { DeviceNotInSystem, messageCommandKeyValueType, NoServiceMessage } from './mqtt-handler.messages';
import { Device } from 'src/device/entities/device.entity';
import { EventEmitter2  } from '@nestjs/event-emitter';

@Injectable()
export class MqttHandlersProviders {
    // publish message 
    constructor(    private readonly eventEmitter: EventEmitter2
    ){}
    handlePublishMessage(typeName: string, dev_id: string) {
        switch (typeName) {
            case "NoServiceMessage": {
             
                const payload = this.generateHexPayload(NoServiceMessage.command, NoServiceMessage.payload)
                return this.publishMessage(dev_id, payload)
            }
            case "DeviceNotInSystem": {
 
                const payload = this.generateHexPayload(NoServiceMessage.command, NoServiceMessage.payload)
                return this.publishMessage(dev_id, payload)
            }
        }
    }



    generateHexPayload(command: number, payload: messageCommandKeyValueType[]) {
        console.log("generate hexpayload", command)
        return {
            command: command,
            payload: payload,
        };
    }

    async publishMessage(device_id, payload) {
        const data = {
            device_id: device_id,
            payload: payload,
        };

        const queryParams = new URLSearchParams(data).toString();

        try {
       
            this.eventEmitter.emit('publishMessage', { data });

            // const response = await axios.get(`http://localhost:3000/mqtt/general?${queryParams}`);
            // return response.data;
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }





    // call to needed function 

    callToNeededFunction(device: Device, data: any) {
        switch (data.command) {
            case 1:
                return "1"

            case 2:
                return "2"
            case 3:
                return "3"
            case 4:
                return "4"
            case 253:
                return "253"
            case 254:
                return "254"
            default:
                break
        }
    }





}
