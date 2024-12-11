import { Module } from '@nestjs/common';
 
import { MqttService } from './mqtt/mqtt.service';
import { MqttModule } from './mqtt/mqtt.module';
 
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device/entities/device.entity';
import { DeviceSettings } from './device/entities/device-settings.entity';
import { DeviceMessages } from './device/entities/device-messages.entity';
import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [MqttModule,   AuthModule, DeviceModule  , 

    TypeOrmModule.forFeature([Auth, Device, DeviceSettings, DeviceMessages  ]), 
    TypeOrmModule.forRoot({
      // logging: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '258741',
      database: 'mqtt-listener',
      entities: [Auth,Device, DeviceSettings, DeviceMessages   ],
      synchronize: true,
    }),

  ],
  controllers: [ ],

})
export class AppModule {}
