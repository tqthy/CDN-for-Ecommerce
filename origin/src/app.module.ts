import { Module } from '@nestjs/common';
import { SharedModule } from './module/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    SharedModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('S3_ENDPOINT'),
        accessKey: configService.get<string>('S3_ACCESS_KEY'),
        secretKey: configService.get<string>('S3_SECRET_KEY'),
        useSSL: configService.get<boolean>('S3_USE_SSL'),
      }),  
      inject: [ConfigService],
    })
  ]  
})
export class AppModule {}
