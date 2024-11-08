import { Module } from "@nestjs/common";
import { FileModule } from "./file/file.module";
import { RootModule } from './root/root.module';
import { MinioStorageModule } from './minio-storage/minio-storage.module';

@Module({
  imports: [FileModule, RootModule, MinioStorageModule],
  exports: [FileModule, RootModule],
})
export class SharedModule {}