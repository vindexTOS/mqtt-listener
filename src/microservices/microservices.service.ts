import { Injectable, Logger } from '@nestjs/common';
import { DeviceSettings } from 'src/device/entities/device-settings.entity';
import { Device } from 'src/device/entities/device.entity';
import { MqttPayload } from 'src/mqtt/mqtt.interface';
import { EntityManager } from 'typeorm';
import * as moment from 'moment-timezone';
@Injectable()
export class MicroservicesService {
    constructor(private readonly entityManager: EntityManager,) { }
    private readonly logger = new Logger(MicroservicesService.name);

    async heartBeatHandler(data: MqttPayload): Promise<any> {
        const { payload, topic } = data;
        const bufferPayload =  payload.payload 
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
        console.log(signal, network, payload.payload)
        const deviceSettings = await this.entityManager.findOne(DeviceSettings, { where: { device: { id: device.id } } })
        device.last_beat = moment().tz('Asia/Tbilisi').toDate();
        deviceSettings.network = network;
        deviceSettings.signal = signal;


        await this.entityManager.save(Device, device);
        await this.entityManager.save(DeviceSettings, deviceSettings);

    }
}
