import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [MinioController],
  providers: [MinioService, RedisService],
})
export class MinioModule {}
