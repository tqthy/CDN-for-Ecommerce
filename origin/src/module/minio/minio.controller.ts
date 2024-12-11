import { Body, Controller, Post } from '@nestjs/common';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {

  }

  @Post('notify')
  async handleMinioNotification(@Body() payload: any) {
    const { Records } = payload;

    if (Records && Records.length > 0) {
      Records.forEach(record => {
        const bucketName = record.s3.bucket.name;
        const objectKey = record.s3.object.key;
        const eventName = record.eventName;
        const eventTime = record.eventTime;
    
        console.log(`Event: ${eventName}, Bucket: ${bucketName}, Key: ${objectKey}, Time: ${eventTime}`);
      });
      
    }
    
    return { message: 'Notification received' };
  }
}
