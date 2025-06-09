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
} from '@nestjs/common';
import { DownloadFotaService } from './download-fota.service';
import { CreateDownloadFotaDto } from './dto/create-download-fota.dto';
import { UpdateDownloadFotaDto } from './dto/update-download-fota.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { EntityManager } from 'typeorm';
import { FirmwareVersion } from 'src/device/entities/firmware.entity';
@Controller('download-fota')
export class DownloadFotaController {
  constructor(private readonly downloadFotaService: DownloadFotaService,     private readonly entityManager: EntityManager,
  )  {}

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('firmware', {
  //     storage: diskStorage({
  //       destination: './uploads/fota',
  //       filename: (req, file, cb) => {
  //         const filename = `${file.originalname}`;
  //         cb(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // async create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createDownloadFotaDto: CreateDownloadFotaDto,
  // ) {
    



  //   return 'HELLOO IT OWKRED';
  // }

  @Post()
  @UseInterceptors(FileInterceptor('firmware'))
  async create(
    @UploadedFile() file: Express.Multer.File,
   
  ) {
    return await this.downloadFotaService.handleUpload(file );
  }

  @Get()
  findAll() {
    return this.downloadFotaService.findAll();
  }

  @Get('download/:version')
  async download(@Param('version') version: string): Promise<StreamableFile> {
    return this.downloadFotaService.downloadFile(version);
  }

  // @Get("download")

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.downloadFotaService.remove(Number(id));
  }


  
}
