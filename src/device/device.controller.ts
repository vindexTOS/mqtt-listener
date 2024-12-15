import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }

  @Post('create')
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

 

  @Get('get-all')
  async findAll(@Query() query: any) {
    return await this.deviceService.findAll(query);
  }
  

  @Get('get-single/:id')
  async findOne(@Param('id') id: string) {
    return await this.deviceService.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(+id, updateDeviceDto);
  }

  @Delete('delete/:id')
 async remove(@Param('id') id: string) {
    return  await this.deviceService.remove(+id);
  }

 
  @Get("/unregistered")
  async getUnregisteredDevices(){
  return await this.deviceService.getUnregisteredDevices()
 
  }

  @Post("/registe/:dev_id")
  async registerDevice(@Param("dev_id") dev_id:string){
    return await this.deviceService.registerDevice(dev_id)
       
  }

  @Delete("/delete-registered/:dev_id")
  async deleteRegisteredDevice(@Param("dev_id") dev_id:string){
    return await this.deviceService.deleteRegisteredDevice(dev_id)
  }
}
