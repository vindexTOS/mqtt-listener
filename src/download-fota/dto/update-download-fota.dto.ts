import { PartialType } from '@nestjs/mapped-types';
import { CreateDownloadFotaDto } from './create-download-fota.dto';

export class UpdateDownloadFotaDto extends PartialType(CreateDownloadFotaDto) {}
