import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { DownloadFotaService } from './download-fota.service';
import { CreateDownloadFotaDto } from './dto/create-download-fota.dto';
import { UpdateDownloadFotaDto } from './dto/update-download-fota.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { EntityManager } from 'typeorm';
import { FirmwareVersion } from 'src/device/entities/firmware.entity';
import { Response } from 'express'; 
import { JwtAuthGuard } from 'src/libs/auth-guard/AuthGuard';
@Controller('download-fota')
export class DownloadFotaController {
  constructor(private readonly downloadFotaService: DownloadFotaService,     private readonly entityManager: EntityManager,
  )  {}

 


 
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('firmware'))
  async create(
    @UploadedFile() file: Express.Multer.File,
   
  ) {
    return await this.downloadFotaService.handleUpload(file );
  }
   @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.downloadFotaService.findAll();
  }

  @Get('download/:version')
  async download(
    @Param('version') version: string,
    @Res() res: Response, // ✅ Express Response for manual headers
  ): Promise<void> {
    return this.downloadFotaService.downloadFileRaw(version, res);
  }


  // @Get("download")

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.downloadFotaService.remove(Number(id));
  }


  
}
