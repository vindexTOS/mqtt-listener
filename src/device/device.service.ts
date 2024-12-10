import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DeviceMessages } from './entities/device-messages.entity';
import { Device } from './entities/device.entity';
import { DeviceSettings } from './entities/device-settings.entity';

@Injectable()
export class DeviceService {
  constructor(
    private readonly entityManager: EntityManager,


  ) { }
  async create(createDeviceDto: CreateDeviceDto) {
    const { dev_id, name } = createDeviceDto;
  
    return await this.entityManager.transaction(async (transactionEntityManager) => {
     
      const device = transactionEntityManager.create(Device, { dev_id, name });
      const savedDevice = await transactionEntityManager.save(device);
  
     
      const newDeviceSettings = transactionEntityManager.create(DeviceSettings, {
        device: savedDevice,  
      });
      await transactionEntityManager.save(newDeviceSettings);
  
     
      const newDeviceMessage = transactionEntityManager.create(DeviceMessages, {
        device: savedDevice, 
      });
      await transactionEntityManager.save(newDeviceMessage);
  
      return savedDevice;
    });
  }

  findAll() {
    return `This action returns all device`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
