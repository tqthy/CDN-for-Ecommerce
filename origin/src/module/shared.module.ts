import { Module } from "@nestjs/common";
import { FileModule } from "./file/file.module";
import { RootModule } from './root/root.module';
import { MinioStorageModule } from './minio-storage/minio-storage.module';
import { MinioModule } from './minio/minio.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [FileModule, RootModule, MinioStorageModule, MinioModule],
  exports: [FileModule, RootModule, MinioModule],
  // providers: [RedisService],
})
export class SharedModule {}