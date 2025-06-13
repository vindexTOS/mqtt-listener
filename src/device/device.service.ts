import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Not, Repository } from 'typeorm';
import { DeviceMessages } from './entities/device-messages.entity';
import { Device } from './entities/device.entity';
import { DeviceSettings } from './entities/device-settings.entity';
import { MessagePattern } from '@nestjs/microservices';
import { UnregisteredDevice } from './entities/device-unregistered.entity';
import * as crypto from 'crypto';
import { MqttHandlersProviders } from 'src/mqtt-handlers/mqtt-handlers.provider';
import { DeviceLockers } from './entities/device-lockers.entity';
@Injectable()
export class DeviceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly mqttHandlerProvider: MqttHandlersProviders,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const { dev_id, name } = createDeviceDto;
    try {
      return await this.entityManager.transaction(
        async (transactionEntityManager) => {
          const plainPassword = crypto.randomBytes(12).toString('hex');
          const md5Hash = crypto
            .createHash('md5')
            .update(plainPassword)
            .digest('hex');
          const device = transactionEntityManager.create(Device, {
            dev_id,
            name,
            password: md5Hash,
          });
          const savedDevice = await transactionEntityManager.save(device);
          // sending message to device

          const newDeviceSettings = transactionEntityManager.create(
            DeviceSettings,
            {
              device: savedDevice,
            },
          );
          await transactionEntityManager.save(newDeviceSettings);

          const newDeviceMessage = transactionEntityManager.create(
            DeviceMessages,
            {
              device: savedDevice,
            },
          );
          await transactionEntityManager.save(newDeviceMessage);

          return savedDevice;
        },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: any) {
    try {
      const { name, dev_id, id } = query;

      const where: any = {};
      if (name) where.name = Like(`%${name}%`);
      if (dev_id) where.dev_id = Like(`%${dev_id}%`);
      if (id) where.id = id;

      // Step 1: Get devices matching filters
      const devices = await this.entityManager.find(Device, { where });

      // Step 2: For each device, fetch and attach settings
      for (const device of devices) {
        const settings = await this.entityManager.findOne(DeviceSettings, {
          where: { device: { id: device.id } },
        });
        const lockers = await this.entityManager.find(DeviceLockers , {where:{ device:{id:device.id}}})
        device['settings'] = settings || null;
        device['lockers'] = lockers || null;
      }

      return devices;
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

    const lockers = await this.entityManager.find(DeviceLockers, {
      where: { device: { id } },
    });

    const result = {
      ...device,
      settings,
      lockers,
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
 
 

      device.dev_id = updateDeviceDto.dev_id;
      device.name = updateDeviceDto.name;

    

      await this.entityManager.save(Device, device);

      return {
        ...device,
   
    
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
      return { data: await this.entityManager.find(UnregisteredDevice) };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async registerDevice(dev_id: string) {
    try {
      const unregisteredDevice = await this.entityManager.findOne(
        UnregisteredDevice,
        {
          where: {
            dev_id,
          },
        },
      );
      if (!unregisteredDevice)
        throw new NotFoundException(
          'Device not found in unregistered devices ',
        );

      return await this.entityManager.transaction(
        async (transactionEntityManager) => {
          const device = transactionEntityManager.create(Device, {
            dev_id,
            name: dev_id,
          });
          const savedDevice = await transactionEntityManager.save(device);

          const newDeviceSettings = transactionEntityManager.create(
            DeviceSettings,
            {
              device: savedDevice,
              soft_version: unregisteredDevice.soft_version,
              hardware_version: unregisteredDevice.hardware_version,
            },
          );
          await transactionEntityManager.save(newDeviceSettings);

          const newDeviceMessage = transactionEntityManager.create(
            DeviceMessages,
            {
              device: savedDevice,
            },
          );
          await transactionEntityManager.save(newDeviceMessage);

          for (let i = 1; i <= 6; i++) {
            const lockers = await transactionEntityManager.create(
              DeviceLockers,
              {
                lockerId: i,
                device_id: savedDevice.id,
                Lockerstatus: false,
                IsCharging: false,
                IsOpen: false,
                PaymentOptions: 0,
              },
            );
            await transactionEntityManager.save(lockers);
          }

          await transactionEntityManager.delete(UnregisteredDevice, { dev_id });
          return savedDevice;
        },
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteRegisteredDevice(dev_id: string) {
    try {
      const unregisteredDevice = await this.entityManager.findOne(
        UnregisteredDevice,
        {
          where: {
            dev_id,
          },
        },
      );
      if (!unregisteredDevice)
        throw new NotFoundException(
          'Device not found in unregistered devices ',
        );

      await this.entityManager.delete(UnregisteredDevice, { dev_id });

      return { message: 'unregistered device was deleted' };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
