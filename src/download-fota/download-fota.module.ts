import { Module } from '@nestjs/common';
import { DownloadFotaService } from './download-fota.service';
import { DownloadFotaController } from './download-fota.controller';

@Module({
  controllers: [DownloadFotaController],
  providers: [DownloadFotaService],
})
export class DownloadFotaModule {}
