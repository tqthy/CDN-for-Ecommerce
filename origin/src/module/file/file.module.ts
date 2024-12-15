import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [FileController],
  providers: [FileService, RedisService],
})
export class FileModule {}
