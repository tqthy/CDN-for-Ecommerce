import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SharedModule } from './module/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HttpMetricsMiddleware } from './middleware/http-metrics.middleware';

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
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    })
  ]  
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpMetricsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
