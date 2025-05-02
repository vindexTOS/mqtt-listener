import { Injectable, Logger } from '@nestjs/common';
import { MqttHandlersProviders } from './mqtt-handlers.provider';
 import { EntityManager } from 'typeorm';
import { DeviceSettings } from 'src/device/entities/device-settings.entity';
import { Device } from 'src/device/entities/device.entity';
import * as moment from 'moment-timezone';
import { UnregisteredDevice } from 'src/device/entities/device-unregistered.entity';
import { MqttPayload } from 'src/mqtt/mqtt.provider';

@Injectable()
export class MqttHandlersService   {
    constructor(private readonly entityManager: EntityManager, private readonly mqttHandlers: MqttHandlersProviders) {
   
    }
    private readonly logger = new Logger(MqttHandlersService.name);
    async heartBeatHandler(data: MqttPayload): Promise<any> {
        console.log("CREAZYINESS")
        const { payload, topic } = data;
        const bufferPayload = payload.payload
        const network = bufferPayload[0];
        const signal = bufferPayload[1];


        const dev_id = topic.split('/')[1];

        const device = await this.entityManager.findOne(Device, {
            where: { dev_id },
        });

        if (!device) {
            this.logger.error("Device has not been found " + " device Id: " + dev_id + " Heart Beat Event")
            return "Device not found"
        }

        const deviceSettings = await this.entityManager.findOne(DeviceSettings, { where: { device: { id: device.id } } })
 
        device.last_beat = moment().tz('Asia/Tbilisi').toDate();
        deviceSettings.network = network;
        deviceSettings.signal = signal;
        console.log( device.last_beat )

        await this.entityManager.save(Device, device);
        await this.entityManager.save(DeviceSettings, deviceSettings);

    }


    async generalEventHandler(data: MqttPayload) {
        const { payload, topic } = data

        const dev_id = topic.split('/')[1];
        this.mqttHandlers.handlePublishMessage("DeviceNotInSystem", dev_id)

        const device = await this.entityManager.findOne(Device, {
            where: { dev_id },
        });

        if (device) {
            console.log("🤑🤑🤑🤑🤑🤑🤑🤑")
            this.logger.log("Device found " + " device Id: " + dev_id + " general event")
            const deviceSettings = await this.entityManager.findOne(DeviceSettings, { where: { device: { id: device.id } } })
            if (deviceSettings.isBlocked) {
                console.log("🤑🤑🤑🤑🤑🤑🤑")
                this.mqttHandlers.handlePublishMessage("NoServiceMessage", dev_id)
            } else {
                console.log("🤑🤑🤑🤑🤑🤑")
                this.mqttHandlers.callToNeededFunction(device, dev_id)
                device.last_beat = moment().tz('Asia/Tbilisi').toDate();
                await this.entityManager.save(Device, device);
            }
            console.log("🤑🤑🤑🤑🤑")
        } else {
            this.mqttHandlers.handlePublishMessage("DeviceNotInSystem", dev_id)
            const unregisteredDevice = await this.entityManager.findOne(UnregisteredDevice, {
                where: {
                    dev_id
                }
            })
            console.log("🤑🤑🤑🤑")
            if (!unregisteredDevice) {
             

             
                const newDevice = this.entityManager.create(UnregisteredDevice, {
                    dev_id,
                    soft_version: "0.0.0",
                    hardware_version:"0.0.0"
                    
                });
                console.log("🤑🤑🤑")
                if (payload.command === 253) {
                    console.log("🤑🤑")
                    const hardware_version = payload?.payload?.substring(0, 3);
                    const soft_version = payload?.payload?.substring(3, 6);

                    newDevice.hardware_version = hardware_version ?  hardware_version : "0.0";
                    newDevice.soft_version = soft_version ? soft_version : "0.0";
                }

                await this.entityManager.save(newDevice);
            }
            if (payload.command === 253 && unregisteredDevice) {
                console.log("🤑")
                unregisteredDevice.hardware_version = payload.payload.substring(0, 3);
                unregisteredDevice.soft_version = payload.payload.substring(3, 6);
                await this.entityManager.save(unregisteredDevice);
            }
        }


        return { "message": "General event processed" }
    }

}
