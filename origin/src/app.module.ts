import { Module } from '@nestjs/common';
import { SharedModule } from './module/shared.module';

@Module({
  imports: [SharedModule,
  ],
})
export class AppModule {}
