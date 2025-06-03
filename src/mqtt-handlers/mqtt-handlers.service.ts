import { Injectable, Logger } from '@nestjs/common';
import { MqttHandlersProviders } from './mqtt-handlers.provider';
import { Between, EntityManager } from 'typeorm';
import { DeviceSettings } from 'src/device/entities/device-settings.entity';
import { Device } from 'src/device/entities/device.entity';
import * as moment from 'moment-timezone';
import { UnregisteredDevice } from 'src/device/entities/device-unregistered.entity';
import { MqttPayload } from 'src/mqtt/mqtt.provider';
import { DeviceErrorLog } from 'src/device/entities/device-errors.entity';
import { ERROR_CODES } from 'src/libs/enums/error.enums';
import { DeviceEarning } from 'src/device/entities/device-earnings.entity';
import { paymentCode, paymentStatus, PaymentTransactions } from 'src/device/entities/payment-transactions.entity';
import { DeviceLockers } from 'src/device/entities/device-lockers.entity';

@Injectable()
export class MqttHandlersService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly mqttHandlers: MqttHandlersProviders,
  ) {}
  private readonly logger = new Logger(MqttHandlersService.name);
  async heartBeatHandler(data: MqttPayload): Promise<any> {
    const { payload, topic } = data;
    const bufferPayload = payload.payload;
    const network = bufferPayload[0];
    const signal = bufferPayload[1];

    const dev_id = topic.split('/')[1];

    const device = await this.entityManager.findOne(Device, {
      where: { dev_id },
    });

    if (!device) {
      this.logger.error(
        'Device has not been found ' +
          ' device Id: ' +
          dev_id +
          ' Heart Beat Event',
      );
      return 'Device not found';
    }

    const deviceSettings = await this.entityManager.findOne(DeviceSettings, {
      where: { device: { id: device.id } },
    });

    device.last_beat = moment().tz('Asia/Tbilisi').toDate();
    deviceSettings.network = network;
    deviceSettings.signal = signal;
    console.log(device.last_beat);

    await this.entityManager.save(Device, device);
    await this.entityManager.save(DeviceSettings, deviceSettings);
  }

  async generalEventHandler(data: MqttPayload) {
    const { payload, topic } = data;
    const dev_id = topic.split('/')[1];

    const device = await this.entityManager.findOne(Device, {
      where: { dev_id },
    });

    if (device) {
      await this.handleRegisteredDevice(device, dev_id, payload);
    } else {
      await this.handleUnregisteredDevice(dev_id, payload);
    }

    return { message: 'General event processed' };
  }

  private async handleRegisteredDevice(
    device: Device,
    dev_id: string,
    payload: any,
  ) {
  const deviceSettings = await this.entityManager.findOne(DeviceSettings, {
  where: { device: { id: device.id } },
});

if (!deviceSettings?.isBlocked && payload.command === 1) {
 const deviceSettings = await this.entityManager.findOne(DeviceSettings, {
  where: { device: { id: device.id } },
});

if (!deviceSettings?.isBlocked && payload.command === 1) {
  // 66 1F A9 12 01 02 e8 03                         1000 tetri satestod 
  this.updateEarnings(device, payload.amount)
     this.createPayment(device.id,   "succeed", payload.amount, "inserted", "payment")

}
}

 if(!deviceSettings?.isBlocked && payload.command === 2){
   // 66 1F A9 12 02 02 01 01 e8 03
   const { amount, operationCode, operationStatus } = payload;
   const status = paymentStatus[operationStatus];
  //  26  da 59 არ გ ჭირდება თანხის ჩაწერა
   if (status === paymentStatus[1]) {
     this.createPayment(
       device.id,
       status,
       amount,
       'terminal',
       paymentCode[operationCode],
     );
     this.updateEarnings(device, amount);
   }else{
       this.createPayment(
       device.id,
       status,
       amount,
       'terminal',
       paymentCode[operationCode],
     );
   }
 }


  if (!deviceSettings.isBlocked && payload.command == 3) {
    // 66 1F A9 12 03 04 01 01 00 02

    //  Lockerstatus	true	Locker is Busy
    //  IsCharging	true	Charging is Active
    //  IsOpen	false	Door is Closed
    //  PaymentOptions	2	Option 2 selected
    //  ლოქერის აიდის დამატება
    //  console.log(payload.lockerStatus)
    const lockers = await this.entityManager.find(DeviceLockers, {
      where: { device: { id: device.id } },
    });

    const updetableLocker: DeviceLockers = lockers.find(
      (val: DeviceLockers) => (val.lockerId = payload.lockerId),
    );
    // console.log(updetableLocker)
    device.last_beat = moment().tz('Asia/Tbilisi').toDate();
 
    updetableLocker.lockerStatus = Boolean(payload.lockerStatus);
    updetableLocker.isOpen = Boolean(payload.lockerDoor);
    updetableLocker.isCharging = Boolean(payload.lockerCharging);
    updetableLocker.paymentOptions = payload.paymentOption;
    await this.entityManager.save(DeviceLockers, updetableLocker);
  }



    if (!deviceSettings.isBlocked && payload.command === 4) {
      // 66 1F A9 12 04 01 0A   test hex data for command 4
      //           alarm_tilt_sensor                      = false
      // alarm_door_sensor                      = true
      // alarm_battery_low_voltage             = false
      // alarm_battery_extremaly_low_voltage   = true
      const buffer = Buffer.from(payload.payload);
      const alarmByte = buffer[0];

      device.last_beat = moment().tz('Asia/Tbilisi').toDate();

      deviceSettings.alarm_tilt_sensor = !!(alarmByte & 0x01);
      deviceSettings.alarm_door_sensor = !!(alarmByte & 0x02);
      deviceSettings.alarm_battery_low_voltage = !!(alarmByte & 0x04);
      deviceSettings.alarm_battery_extremaly_low_voltage = !!(alarmByte & 0x08);

      await this.entityManager.save(DeviceSettings, deviceSettings);
      await this.entityManager.save(Device, device);
    }

  


    if (!deviceSettings.isBlocked && payload.command === 254) {
      // 66 1F A9 12 FE 01 03

      // Locker/10500031414D501220313243/events/general
      const errorByte = payload.payload[0];
    
   
    
      const message = ERROR_CODES[errorByte] || `Unknown error (code ${errorByte})`;
    
    
      const errorLog = this.entityManager.create(DeviceErrorLog, {
        error_code: errorByte,
        error_message: message,
        device: device, 
      });
    
      await this.entityManager.save(DeviceErrorLog, errorLog);
    
       
      device.last_beat = moment().tz('Asia/Tbilisi').toDate();
      await this.entityManager.save(Device, device);
    
      this.logger.debug(`❌ DEVICE ERROR [${device.dev_id}] → ${message} (code ${errorByte})`);
    }

    if (!deviceSettings.isBlocked && payload.command === 240){
      //  F0 07 01 30 30 41 01 00 00
      const {device_type,hardware_version ,software_version} = payload
        console.log(payload)

        // {
        //   timestamp: 1713350930,
        //   command: 240,
        //   length: 7,
        //   payload: <Buffer 01 30 30 41 01 00 00>,
        //   device_type: 1,
        //   hardware_version: '00A',
        //   software_version: '1.0.0'
        // }
        deviceSettings.device_type = device_type;
        deviceSettings.soft_version =software_version;
        deviceSettings.hardware_version =hardware_version;
   

       await this.entityManager.save(DeviceSettings, deviceSettings);
      await this.entityManager.save(Device, device);
    } 

  }
  private async handleUnregisteredDevice(dev_id: string, payload: any) {
    let unregisteredDevice = await this.entityManager.findOne(
      UnregisteredDevice,
      {
        where: { dev_id },
      },
    );
    // 66 1F A9 12 FD 06 31 30 30 39 30 32
    // Locker/10500031414D501220313243/events/general
    // for testing
    switch (payload.command) {
      case 253: {
        const rawStr = payload.payload.toString('utf8');

        // Defensive fallback
        const hardware_version = rawStr.substring(0, 3) || '0.0';
        const soft_version = rawStr.substring(3, 6) || '0.0';

        if (unregisteredDevice) {
          unregisteredDevice.hardware_version = hardware_version;
          unregisteredDevice.soft_version = soft_version;
          await this.entityManager.save(UnregisteredDevice, unregisteredDevice);
        } else {
          const newDevice = this.entityManager.create(UnregisteredDevice, {
            dev_id,
            hardware_version,
            soft_version,
          });
          await this.entityManager.save(UnregisteredDevice, newDevice);
        }
        break;
      }

      default:
        // Just create a blank unregistered device if it doesn't exist
        if (!unregisteredDevice) {
          const newDevice = this.entityManager.create(UnregisteredDevice, {
            dev_id,
            hardware_version: '0.0.0',
            soft_version: '0.0.0',
          });
          await this.entityManager.save(UnregisteredDevice, newDevice);
        }
        break;
    }
  }
  // private async handleUnregisteredDevice(dev_id: string, payload: any) {
  //   let unregisteredDevice = await this.entityManager.findOne(UnregisteredDevice, {
  //     where: { dev_id },
  //   });

  //   switch (payload.command) {
  //     case 253:
  //       await this.registerOrUpdateUnregisteredDevice(unregisteredDevice, dev_id, payload);
  //       break;

  //     default:
  //       if (!unregisteredDevice) {
  //         const newDevice = this.entityManager.create(UnregisteredDevice, {
  //           dev_id,
  //           soft_version: "0.0.0",
  //           hardware_version: "0.0.0",
  //         });
  //         await this.entityManager.save(newDevice);
  //       }
  //       break;
  //   }
  // }

  // private async registerOrUpdateUnregisteredDevice(
  //   unregisteredDevice: UnregisteredDevice | null,
  //   dev_id: string,
  //   payload: any,
  // ) {
  //   const hardware_version = payload?.payload?.substring(0, 3) || '0.0';
  //   const soft_version = payload?.payload?.substring(3, 6) || '0.0';

  //   if (unregisteredDevice) {
  //     unregisteredDevice.hardware_version = hardware_version;
  //     unregisteredDevice.soft_version = soft_version;
  //     await this.entityManager.save(unregisteredDevice);
  //   } else {
  //     const newDevice = this.entityManager.create(UnregisteredDevice, {
  //       dev_id,
  //       hardware_version,
  //       soft_version,
  //     });
  //     await this.entityManager.save(newDevice);
  //   }
  // }

  private async updateEarnings(device:Device  , amount:number){
     const todaysDate = moment().tz('Asia/Tbilisi');

   const monthStart = todaysDate.clone().startOf('month').toDate();
  const monthEnd = todaysDate.clone().endOf('month').toDate();


   const existingEarnings = await this.entityManager.findOne(DeviceEarning, {
    where: {
      device_id:device.id,
      createdAt: Between(monthStart, monthEnd),
    },
  });

  if (!existingEarnings) {
     await this.entityManager.save(DeviceEarning, {
      device,
      date: todaysDate.toDate(),
      amount: amount,
    });
  } else {
     existingEarnings.amount += amount;

    await this.entityManager.save(DeviceEarning, existingEarnings);
  }

  }

private async createPayment(deviceId: number, status: string, amount: number, type: string, operationCode:string) {
  const payment = this.entityManager.create(PaymentTransactions, {
    deviceId,    
    status,
    amount,
    type,
    operationCode
  });

  await this.entityManager.save(payment);  
}
}
