import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomSwagger } from './custom-swagger.provider';

async function bootstrap() {
  const PORT = new ConfigService().get('PORT');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());

  CustomSwagger(app);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap().catch((error) => {
  console.error('Server not started, error:', error);
});
