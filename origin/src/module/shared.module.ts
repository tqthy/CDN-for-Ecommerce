import { Module } from "@nestjs/common";
import { FileModule } from "./file/file.module";
import { RootModule } from './root/root.module';
import { MinioStorageModule } from './minio-storage/minio-storage.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [FileModule, RootModule, MinioStorageModule, MinioModule],
  exports: [FileModule, RootModule, MinioModule],
})
export class SharedModule {}