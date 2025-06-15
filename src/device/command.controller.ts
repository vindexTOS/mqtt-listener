import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StorageResetOptions } from 'src/mqtt-handlers/mqtt-handler.messages';
import { MqttHandlersProviders } from 'src/mqtt-handlers/mqtt-handlers.provider';
import { MqttHandlersService } from 'src/mqtt-handlers/mqtt-handlers.service';
import {
  CreateAppConfigDto,
  CreateAppExt1ConfigDto,
  OpenDoorDto,
  ResetDeviceDto,
  ResetLockerPasswordDto,
  UpdateFirmwareDto,
} from './dto/commands.dto';

import * as dotenv from 'dotenv';
import { DeviceSettings } from './entities/device-settings.entity';
import { EntityManager } from 'typeorm';
import { Device } from './entities/device.entity';
import { DeviceLockers } from './entities/device-lockers.entity';
import { FirmwareVersion } from './entities/firmware.entity';
import { JwtAuthGuard } from 'src/libs/auth-guard/AuthGuard';

dotenv.config();
@UseGuards(JwtAuthGuard)
@Controller('commands')
export class CommandController {
  constructor(
    private readonly mqttHandlerProvider: MqttHandlersProviders,
    private readonly entetieManager: EntityManager,
  ) {}

 
  @Get('reset-command-options')
  async sendResetCommandOptions() {
    return StorageResetOptions;
  }

  @Post('reset-device')
  async resetDevice(@Body() body: ResetDeviceDto) {
    const { resetSection, dev_id } = body;
    return await this.mqttHandlerProvider.handlePublishMessage(
      'ResetStorage',
      dev_id,
      String(resetSection),
    );
  }

  @Post('update-firmware')
  async updateFirmware( @Body() body:UpdateFirmwareDto ) {
  
  const {id, dev_id} = body
    const firmWare = await this.entetieManager.findOne(FirmwareVersion, {
      where: { id:Number(id)  },
    });
    if (!firmWare) {
      throw new HttpException(
        'Firmware not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const { version,  crc32, fileLength } = firmWare;

    const url = `http://116.203.146.251/download-fota/download/${version}`
     return await this.mqttHandlerProvider.handlePublishMessage(
      'UpdateFirmware',
      dev_id,
      { url, version, crc32,fileLength },
    );
  }

  @Post('send-appconfig-t/:dev_id')
  async sendAppConfig(
    @Param('dev_id') dev_id: string,
    @Body() dto: CreateAppConfigDto,
  ) {
    const device = await this.entetieManager.findOne(Device, {
      where: { dev_id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    const {
      startup,
      paymentLimit,
      fineAmountPerMinute,
      doorAutoCloseTimeMs,
      menuTimeoutMs,
      services,
      overTimeAmountPerMinute,
    } = dto;

    const resultPayLoad = await this.mqttHandlerProvider.handlePublishMessage(
      'SendAppConfig',
      dev_id,
      {
        startup,
        paymentLimit,
        fineAmountPerMinute,
        doorAutoCloseTimeMs,
        menuTimeoutMs,
        overTimeAmountPerMinute,
        services,
      },
    );

    await this.entetieManager.update(
      DeviceSettings,
      { device },
      {
  
        paymentLimit,
        fineAmountPerMinute,
        doorAutoCloseTimeMs,
        menuTimeoutMs,
        service2Time: services[1].time,
        service3Time: services[2].time,
        service4Time: services[3].time,
        service1Amount: services[0].amount,
        service2Amount: services[1].amount,
        service3Amount: services[2].amount,
        service4Amount: services[3].amount,
        overTimeAmountPerMinute,
      },
    );

    return resultPayLoad;
  }

  @Post('send-appext1config/:dev_id')
  async sendAppExtConfig(
    @Param('dev_id') dev_id: string,
    @Body() dto: CreateAppExt1ConfigDto,
  ) {
    const device = await this.entetieManager.findOne(Device, {
      where: { dev_id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    const resultPayLoad = await this.mqttHandlerProvider.handlePublishMessage(
      'SendAppExt1Config',
      dev_id,
      dto,
    );
    const wifiPassword = dto.password;
    delete dto.password;
    await this.entetieManager.update(
      DeviceSettings,
      { device },
      { ...dto, wifiPassword },
    );
    return resultPayLoad;
  }

  @Post('reset-locker-password/:dev_id')
  async resetLockerPassword(
    @Param('dev_id') dev_id: string,
    @Body() dto: ResetLockerPasswordDto,
  ) {
    const device = await this.entetieManager.findOne(Device, {
      where: { dev_id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    const locker = await this.entetieManager.findOne(DeviceLockers, {
      where: {
        device: { id: device.id },
        lockerId: dto.lockerId,
      },
    });

    if (!locker) {
      throw new Error(`Locker ID ${dto.lockerId} not found for this device.`);
    }

    const resultPayLoad = await this.mqttHandlerProvider.handlePublishMessage(
      'ResetLockerPassword',
      dev_id,
      dto,
    );
    await this.entetieManager.update(DeviceLockers, locker.id, dto);

    return resultPayLoad;
  }

  @Post('open-locker/:dev_id')
  async openLocker(@Param('dev_id') dev_id: string, @Body() dto: OpenDoorDto) {
 
    const device = await this.entetieManager.findOne(Device, {
      where: { dev_id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return await this.mqttHandlerProvider.handlePublishMessage(
      'OpenClose',
      dev_id,
      dto,
    );
  }
  @Post('payment-reconciliation/:dev_id')
  async reconciliation(@Param('dev_id') dev_id: string  ) {
 
    const device = await this.entetieManager.findOne(Device, {
      where: { dev_id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return await this.mqttHandlerProvider.handlePublishMessage(
      'Reconciliation',
      dev_id,
      
    );
  }
}
