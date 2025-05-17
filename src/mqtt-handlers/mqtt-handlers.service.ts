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
        const { payload, topic } = data;
        const dev_id = topic.split('/')[1];
      
       
        const device = await this.entityManager.findOne(Device, { where: { dev_id } });
       
        if (device) {
          await this.handleRegisteredDevice(device, dev_id, payload);
        } else {
          await this.handleUnregisteredDevice(dev_id, payload);
        }
      
        return { message: "General event processed" };
      }
      
      private async handleRegisteredDevice(device: Device, dev_id: string, payload:any) {
        console.log(payload.command, "LIVER")
      
        const deviceSettings = await this.entityManager.findOne(DeviceSettings, {
          where: { device: { id: device.id } },
        });
 

        if(!deviceSettings.isBlocked && payload.command == 4){
            device.last_beat = moment().tz('Asia/Tbilisi').toDate();
            console.log(payload)
            // deviceSettings.Alarm = payload.paymentOption
            await this.entityManager.save(DeviceSettings, deviceSettings);
            await this.entityManager.save(Device, device);
        }

        if (!deviceSettings.isBlocked && payload.command == 3) {
          this.mqttHandlers.callToNeededFunction(device, dev_id);
          device.last_beat = moment().tz('Asia/Tbilisi').toDate();
          deviceSettings.Lockerstatus = Boolean(payload.lockerStatus) 
          deviceSettings.IsOpen = Boolean(payload.lockerDoor) 
          deviceSettings.IsCharging = Boolean(payload.lockerCharging) 
          deviceSettings.PaymentOptions = payload.paymentOption
          await this.entityManager.save(DeviceSettings, deviceSettings);
          await this.entityManager.save(Device, device);
        }


      
      }
      
      private async handleUnregisteredDevice(dev_id: string, payload: any) {
        let unregisteredDevice = await this.entityManager.findOne(UnregisteredDevice, {
          where: { dev_id },
        });
      
        switch (payload.command) {
          case 253:
            await this.registerOrUpdateUnregisteredDevice(unregisteredDevice, dev_id, payload);
            break;
      
          default:
            if (!unregisteredDevice) {
              const newDevice = this.entityManager.create(UnregisteredDevice, {
                dev_id,
                soft_version: "0.0.0",
                hardware_version: "0.0.0",
              });
              await this.entityManager.save(newDevice);
            }
            break;
        }
      }
      
      private async registerOrUpdateUnregisteredDevice(
        unregisteredDevice: UnregisteredDevice | null,
        dev_id: string,
        payload: any,
      ) {
        const hardware_version = payload?.payload?.substring(0, 3) || "0.0";
        const soft_version = payload?.payload?.substring(3, 6) || "0.0";
      
        if (unregisteredDevice) {
          unregisteredDevice.hardware_version = hardware_version;
          unregisteredDevice.soft_version = soft_version;
          await this.entityManager.save(unregisteredDevice);
        } else {
          const newDevice = this.entityManager.create(UnregisteredDevice, {
            dev_id,
            hardware_version,
            soft_version,
          });
          await this.entityManager.save(newDevice);
        }
      }
      
}
