import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceSettings } from './entities/device-settings.entity';
import { DeviceMessages } from './entities/device-messages.entity';
 

@Module({
  imports:[
    TypeOrmModule.forFeature([Device, DeviceSettings, DeviceMessages  ]), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '258741',
      database: 'mqtt-listener',
      entities: [Device, DeviceSettings, DeviceMessages   ],
      synchronize: true,
    }),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
