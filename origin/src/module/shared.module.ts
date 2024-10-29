import { Module } from "@nestjs/common";
import { FileModule } from "./file/file.module";
import { RootModule } from './root/root.module';

@Module({
  imports: [FileModule, RootModule],
  exports: [FileModule, RootModule],
})
export class SharedModule {}