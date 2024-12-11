import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { GetObjectOpts } from 'minio/dist/main/internal/type';

@Injectable()
export class FileService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService) {}

  async generatePreSignedUrl(contentType: string) {
    const fileName = `${randomUUID()}.${contentType.split('/')[1]}`;
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    
    // const presignedUrl = await this.minioClient.presignedPutObject(bucketName, fileName);
    const presignedUrl = await this.minioClient.presignedUrl('PUT', 
      bucketName, 
      fileName, 
      24 * 60 * 60, 
      { 
        'x-amz-meta-cache-control': '100',
        'Content-Type': contentType,
      });
    return { presignedUrl, fileName };
  }

  async get(key: string, path: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    try {
      const metadata = await this.minioClient.statObject(bucketName, key);

      await this.minioClient.fGetObject(bucketName, key, path);

      return metadata;
    } catch (error) {
      console.error('Error fetching object:', error);
      throw new Error(error.message);
    }
  ;
    
  }

  upload(createFileDto: CreateFileDto) {
    throw new Error('Method not implemented.');
  }
}
