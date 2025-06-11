import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
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

  testCRCFromWord(word: string) {
    const buffer = Buffer.from(word, 'utf8'); // or 'ascii' if needed
    const crc = this.crc32Custom(buffer);
    const crcHex = crc.toString(16).toUpperCase().padStart(8, '0');
    console.log(`🔍 Word: "${word}" → CRC32: ${crcHex}`);
    return { word, crc, crcHex };
  }

  async handleUpload(file: Express.Multer.File) {
    try {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'fota');
      const filename = file.originalname;
      const filePath = path.join(uploadDir, filename);

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(filePath, file.buffer);

      const reversedName = filename.split('').reverse().join('');

      const versionRevers =
        reversedName.length >= 9 ? reversedName.slice(4, 9) : '0.0.0';
      const version = versionRevers.split('').reverse().join('');
      const isFirmwareExist = await this.entityManager.findOne(
        FirmwareVersion,
        { where: { version } },
      );
      if (isFirmwareExist) {
        throw new ConflictException(
          `Firmware with version ${version} already exists.`,
        );
      }

      const originalBuffer = file.buffer;  
      const fileLength = originalBuffer.length;

      const crc = this.crc32Custom(originalBuffer);
      const crcHex = crc.toString(16).toUpperCase().padStart(8, '0');
      console.log('CRC (full buffer):', crcHex, crc);

      const firmware = this.entityManager.create(FirmwareVersion, {
        version: version,
        file_url: `/uploads/fota/${filename}`,
        crc32: String(crc),
        fileLength,
      });

      await this.entityManager.save(FirmwareVersion, firmware);

      return {
        message: 'Firmware uploaded successfully',
        version: version,
        file_url: firmware.file_url,
        crc32: crc,
        fileLength,
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw new ConflictException(err);
      }
      throw new InternalServerErrorException('Upload failed: ' + err.message);
    }
  }

  // Your crc32Custom function must be defined somewhere in the service:
  private crc32Custom(buffer: Buffer, initial = 0xffffffff): number {
    let crc = initial;
    for (let i = 0; i < buffer.length; i++) {
      crc ^= buffer[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return ~crc >>> 0; // ✅ proper C-style final inversion
  }
  async findAll() {
    return await this.entityManager.find(FirmwareVersion);
  }
  findOne(id: number) {
    return `This action returns a #${id} downloadFota`;
  }

  update(id: number, updateDownloadFotaDto: UpdateDownloadFotaDto) {
    return `This action updates a #${id} downloadFota`;
  }

  async remove(id: number) {
    try {
      const firmware = await this.entityManager.findOne(FirmwareVersion, {
        where: { id },
      });

      if (!firmware) {
        throw new NotFoundException(
          `Firmware version with ID ${id} not found.`,
        );
      }

      const filePath = path.join(__dirname, '..', '..', firmware.file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await this.entityManager.remove(FirmwareVersion, firmware);

      return { message: 'Firmware deleted successfully', id };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Unexpected error while deleting firmware',
      );
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
      disposition: `attachment; filename="Smart_Locker_Ver${version}.bin"`,
    });
  }
}
