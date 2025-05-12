import { Injectable } from '@nestjs/common';
import { CreateDevice, DeviceNotInSystem, messageCommandKeyValueType, NoServiceMessage, PasswordCommand } from './mqtt-handler.messages';
import { Device } from 'src/device/entities/device.entity';
import { EventEmitter2  } from '@nestjs/event-emitter';

@Injectable()
export class MqttHandlersProviders {
    // publish message 
    constructor(    private readonly eventEmitter: EventEmitter2
    ){}
    handlePublishMessage(typeName: string, dev_id: string, passedPayload?:any) {
        switch (typeName) {
            case "NoServiceMessage": {
             
                const payload = this.generateHexPayload(NoServiceMessage.command, NoServiceMessage.payload)
                return this.publishMessage(dev_id, payload)
            }
            case "DeviceNotInSystem": {
 
                const payload = this.generateHexPayload(NoServiceMessage.command, NoServiceMessage.payload)
                return this.publishMessage(dev_id, payload)
            }
            case "RegisterDevice": {
                const CreateDevicePayload = CreateDevice(passedPayload.md5Hash)
                const payload = this.generateHexPayload(CreateDevicePayload.command,CreateDevicePayload.payload )
                return this.publishMessage(dev_id, payload)

            }
            case "SetPassword": {
             
                const commandPayload = PasswordCommand(passedPayload );
                const payload = this.generateHexPayload(commandPayload.command, commandPayload.payload);
                return this.publishMessage(dev_id, payload);
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
     
        this.eventEmitter.emit('publishMessage', { data });
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



//   celular remote number call 
//  sending device commands by calling 
async accessRequestForCellularRemoteNumber(device:Device, data:any){}
}
