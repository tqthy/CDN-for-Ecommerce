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
    
    const presignedUrl = await this.minioClient.presignedPutObject(bucketName, fileName);
    return { presignedUrl, fileName };
  }

  async get(key: string, path: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    return new Promise<void>((resolve, reject) => {
      this.minioClient.fGetObject(bucketName, key, path)
        .then(() => {
          console.log('Download complete');
          resolve();
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
    // return new Promise<{ dataStream: any, size: number }>(async (resolve, reject) => {
    //   let size = 0;
      
    //   try {
    //     const dataStream = await this.minioClient.getObject(bucketName, key);
        
    //     dataStream.on('data', (chunk) => {
    //       size += chunk.length;
    //     });
        
    //     dataStream.on('end', () => {
    //       console.log('End. Total size = ' + size);
    //       resolve({ dataStream, size });
    //     });
        
    //     dataStream.on('error', (err) => {
    //       console.error('Error streaming from MinIO:', err);
    //       reject(new Error(err.message));
    //     });
        
    //   } catch (err) {
    //     console.error('Error fetching object:', err);
    //     reject(new Error(err.message));
    //   }
    // });
  }

  upload(createFileDto: CreateFileDto) {
    throw new Error('Method not implemented.');
  }
}
