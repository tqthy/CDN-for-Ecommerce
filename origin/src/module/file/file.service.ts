import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService) {}

  async generatePreSignedUrl(contentType: string) {
    const fileName = `${randomUUID()}.${contentType.split('/')[1]}`;
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    const presignedUrl = await this.minioClient.presignedPutObject(bucketName, fileName);
    return { presignedUrl, fileName };
  }

  get(key: string) {
    throw new Error('Method not implemented.');
  }
  upload(createFileDto: CreateFileDto) {
    throw new Error('Method not implemented.');
  }
}
