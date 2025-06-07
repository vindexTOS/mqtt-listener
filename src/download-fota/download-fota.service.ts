import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { CreateDownloadFotaDto } from './dto/create-download-fota.dto';
import { UpdateDownloadFotaDto } from './dto/update-download-fota.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EntityManager } from 'typeorm';
import { FirmwareVersion } from 'src/device/entities/firmware.entity';
import * as CRC32 from 'crc-32';

@Injectable()
export class DownloadFotaService {
  constructor(private readonly entityManager: EntityManager) {}
  private crc32Custom(buffer: Buffer): number {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buffer.length; i++) {
      crc ^= buffer[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
      }
    }
    return crc >>> 0;
  }

  async handleUpload(file: Express.Multer.File) {
    try {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'fota');
      const filename = file.originalname;
      const filePath = path.join(uploadDir, filename);

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(filePath, file.buffer);

      const reversedName = filename.split('').reverse().join('');
      const version = reversedName.length >= 9 ? reversedName.slice(4, 9) : '0.0.0';

      const existing = await this.entityManager.findOne(FirmwareVersion, {
        where: { version },
      });

      if (existing) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new ConflictException(`Version: ${version} already exists`);
      }

      const crc = this.crc32Custom(file.buffer);
      const crcHex = crc.toString(16).toUpperCase().padStart(8, '0');
      const fileLength = file.buffer.length;

      const firmware = this.entityManager.create(FirmwareVersion, {
        version,
        file_url: `/uploads/fota/${filename}`,
        crc32: crcHex,
        fileLength
      });

      await this.entityManager.save(FirmwareVersion, firmware);

      return {
        message: 'Firmware uploaded successfully',
        version,
        file_url: firmware.file_url,
        crc32: crcHex,
        fileLength
      };
    } catch (err) {
      throw new InternalServerErrorException('Upload failed: ' + err.message);
    }
  }
  async findAll() {
    return  await this.entityManager.find(FirmwareVersion);
  }
  findOne(id: number) {
    return `This action returns a #${id} downloadFota`;
  }

  update(id: number, updateDownloadFotaDto: UpdateDownloadFotaDto) {
    return `This action updates a #${id} downloadFota`;
  }

  async remove(id: number) {
    try {
      const firmware = await this.entityManager.findOne(FirmwareVersion, { where: { id } });
  
      if (!firmware) {
        throw new NotFoundException(`Firmware version with ID ${id} not found.`);
      }
  
     
      const filePath = path.join(__dirname, '..', '..', firmware.file_url);  
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      
      await this.entityManager.remove(FirmwareVersion, firmware);
  
      return { message: 'Firmware deleted successfully', id };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error while deleting firmware');
    }
  }

  async downloadFile(version: string): Promise<StreamableFile> {
    const firmware = await this.entityManager.findOne(FirmwareVersion, {
      where: { version },
    });

    if (!firmware) {
      throw new NotFoundException(`Firmware version ${version} not found`);
    }

    const filePath = path.join(__dirname, '..', '..', firmware.file_url);  
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Firmware file not found on server`);
    }

    const fileStream = fs.createReadStream(filePath);
    return new StreamableFile(fileStream, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${version}.bin"`,
    });
  }
}
