import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';
import { DeviceMessages } from './entities/device-messages.entity';
import { Device } from './entities/device.entity';
import { DeviceSettings } from './entities/device-settings.entity';
import { MessagePattern } from '@nestjs/microservices';
import { UnregisteredDevice } from './entities/device-unregistered.entity';

@Injectable()
export class DeviceService {
  constructor(
    private readonly entityManager: EntityManager) { }



  async create(createDeviceDto: CreateDeviceDto) {
    const { dev_id, name } = createDeviceDto;
    try {


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

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(query: any) {
    try {
      const { name, dev_id, id, sort } = query;


      const qb = this.entityManager.createQueryBuilder(Device, 'device');

      if (name) {
        qb.andWhere('device.name LIKE :name', { name: `%${name}%` });
      }

      if (dev_id) {
        qb.andWhere('device.dev_id LIKE :dev_id', { dev_id: `%${dev_id}%` });
      }

      if (id) {
        qb.andWhere('device.id = :id', { id });
      }


      if (sort) {
        const order = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        qb.orderBy('device.createdAt', order);
      } else {
        qb.orderBy('device.createdAt', 'ASC');
      }

      return await qb.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOne(id: number) {
    try {
      const device = await this.entityManager.findOne(Device, {
        where: { id },
      });

      if (!device) throw new NotFoundException('Device does not exist');

      const settings = await this.entityManager.findOne(DeviceSettings, {
        where: { device: { id } },
      });

      const messages = await this.entityManager.findOne(DeviceMessages, {
        where: { device: { id } },
      });

      const result = {
        ...device,
        settings,
        messages,
      };

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    try {
      const device = await this.entityManager.findOne(Device, {
        where: { id },
      });

      if (!device) {
        throw new NotFoundException(`Device with ID ${id} not found`);
      }

      const settings = await this.entityManager.findOne(DeviceSettings, {
        where: { device: { id } },
      });

      const messages = await this.entityManager.findOne(DeviceMessages, {
        where: { device: { id } },
      });

      device.dev_id = updateDeviceDto.dev_id;
      device.name = updateDeviceDto.name;

      if (settings) {
        settings.relay_pulse_time = updateDeviceDto.relay_pulse_time;
        settings.lcd_brightness = updateDeviceDto.lcd_brightness;
        settings.led_brightness = updateDeviceDto.led_brightness;
        settings.msg_appear_time = updateDeviceDto.msg_appear_time;
        settings.storage_disable = updateDeviceDto.storage_disable;
        settings.relay1_node = updateDeviceDto.relay1_node;
        settings.op_mode = updateDeviceDto.op_mode;
        settings.soft_version = updateDeviceDto.soft_version;
        settings.hardware_version = updateDeviceDto.hardware_version;
        settings.limit = updateDeviceDto.limit;
        settings.network = updateDeviceDto.network;
        settings.signal = updateDeviceDto.signal;

        await this.entityManager.save(DeviceSettings, settings);
      }

      await this.entityManager.save(Device, device);

      return {
        ...device,
        settings,
        messages,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {

      const device = await this.entityManager.findOne(Device, {
        where: { id },
      });

      if (!device) {
        throw new NotFoundException(`Device with ID ${id} not found`);
      }

      await this.entityManager.delete(DeviceSettings, { device: { id } });
      await this.entityManager.delete(DeviceMessages, { device: { id } });


      await this.entityManager.delete(Device, id);

      return { message: `Device with ID ${id} has been removed successfully.` };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //  unregisted device

  async getUnregisteredDevices() {

    try {
   

    
      return { data: await this.entityManager.find(UnregisteredDevice )  };
 
    } catch (error) {
      throw new InternalServerErrorException(error.message);

    }
  }
  async registerDevice(dev_id: string) {
    try {
      const unregisteredDevice = await this.entityManager.findOne(UnregisteredDevice, {
        where: {
          dev_id
        }
      })
      if (!unregisteredDevice) throw new NotFoundException("Device not found in unregistered devices ")

      return await this.entityManager.transaction(async (transactionEntityManager) => {

        const device = transactionEntityManager.create(Device, { dev_id, name: dev_id });
        const savedDevice = await transactionEntityManager.save(device);


        const newDeviceSettings = transactionEntityManager.create(DeviceSettings, {
          device: savedDevice, soft_version: unregisteredDevice.soft_version, hardware_version: unregisteredDevice.hardware_version
        });
        await transactionEntityManager.save(newDeviceSettings);


        const newDeviceMessage = transactionEntityManager.create(DeviceMessages, {
          device: savedDevice,
        });
        await transactionEntityManager.save(newDeviceMessage);
        await transactionEntityManager.delete(UnregisteredDevice, { dev_id });      
          return savedDevice;
      });

    } catch (error) {
      if (error instanceof NotFoundException) throw new NotFoundException(error)
      throw new InternalServerErrorException(error.message);

    }
  }

  async deleteRegisteredDevice(dev_id:string){
    try {
      const unregisteredDevice = await this.entityManager.findOne(UnregisteredDevice, {
        where: {
          dev_id
        }
      })
      if (!unregisteredDevice) throw new NotFoundException("Device not found in unregistered devices ")

        await this.entityManager.delete(UnregisteredDevice, {  dev_id  });  
       
        return {message:"unregistered device was deleted"}
    } catch (error) {
      if (error instanceof NotFoundException) throw new NotFoundException(error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
