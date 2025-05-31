import { Module } from '@nestjs/common';
 
 import { MqttModule } from './mqtt/mqtt.module';
 
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device/entities/device.entity';
import { DeviceSettings } from './device/entities/device-settings.entity';
import { DeviceMessages } from './device/entities/device-messages.entity';
import { Auth } from './auth/entities/auth.entity';
import { MicroservicesModule } from './microservices/microservices.module';
 import { MqttHandlersModule } from './mqtt-handlers/mqtt-handlers.module';
import { UnregisteredDevice } from './device/entities/device-unregistered.entity';
 import * as dotenv from 'dotenv';
import { DeviceEarning } from './device/entities/device-earnings.entity';
import { DeviceErrorLog } from './device/entities/device-errors.entity';
import { DownloadFotaModule } from './download-fota/download-fota.module';
import { FirmwareVersion } from './device/entities/firmware.entity';
import { PaymentTransactions } from './device/entities/payment-transactions.entity';
dotenv.config();
@Module({
  imports: [MqttModule, AuthModule, DeviceModule  ,  

    TypeOrmModule.forFeature([Auth, Device, DeviceSettings, DeviceMessages ,UnregisteredDevice , DeviceEarning, DeviceErrorLog , FirmwareVersion, PaymentTransactions]), 
    TypeOrmModule.forRoot({
 
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'mqtt-listener',
      entities: [Auth,Device, DeviceSettings, DeviceMessages ,UnregisteredDevice , DeviceEarning , DeviceErrorLog,FirmwareVersion,PaymentTransactions],
      synchronize: true,
    }), MicroservicesModule, MqttHandlersModule, DownloadFotaModule,

  ],
  controllers: [ ],
  providers: [ ],

})
export class AppModule {}
