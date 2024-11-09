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
        port: 9000,
        accessKey: configService.get<string>('S3_ACCESS_KEY'),
        secretKey: configService.get<string>('S3_SECRET_KEY'),
        useSSL: (configService.get<string>('S3_USE_SSL') === 'true'), 
      }),  
      inject: [ConfigService],
    })
  ]  
})
export class AppModule {}
