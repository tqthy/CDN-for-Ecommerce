import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { END_POINTS } from './utils/endPoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(END_POINTS.BASE);

  await app.listen(3000);
}
bootstrap();
