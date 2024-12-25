import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { GetObjectOpts } from 'minio/dist/main/internal/type';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService) {}

  async generatePreSignedUrl(contentType: string, fileName: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    
    // const presignedUrl = await this.minioClient.presignedPutObject(bucketName, fileName);
    const presignedUrl = await this.minioClient.presignedUrl('PUT', 
      bucketName, 
      fileName, 
      24 * 60 * 60, 
      { 
        'x-amz-meta-cache-max-age': '10',
        'Content-Type': contentType,
      });
    return { presignedUrl, fileName };
  }

  async get(key: string, filePath: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    try {
      const objectStream: Readable = await this.minioClient.getObject(bucketName, key);
  
      const writableStream = fs.createWriteStream(filePath);
  
      return new Promise<string>((resolve, reject) => {
        objectStream.pipe(writableStream);
  
        writableStream.on('finish', () => {
          console.log(`File saved successfully to ${filePath}`);
          resolve(filePath);
        });
        objectStream.on('error', (err) => {
          console.error('Error while reading the object stream:', err);
          reject(err);
        });
        writableStream.on('error', (err) => {
          console.error('Error while writing the file stream:', err);
          reject(err);
        });
      });
  
    } catch (error) {
      console.error('Error fetching object:', error);
      throw new Error(error.message);
    }
  }

  async getMetadata(key: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    return this.minioClient.statObject(bucketName, key);
  }

  upload(createFileDto: CreateFileDto) {
    throw new Error('Method not implemented.');
  }
}
