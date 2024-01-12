import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomSwagger } from './custom-swagger.provider';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { MyLoggerService } from './my-logger/my-logger.service';

const configService = new ConfigService();

async function bootstrap() {
  const PORT = new ConfigService().get('PORT');
  const app = await NestFactory.create(AppModule, {
    logger: new MyLoggerService(),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const allowedOriginsConfig = configService.get<string>('ALLOWED_ORIGINS');

  const allowedOrigins = allowedOriginsConfig
    ? allowedOriginsConfig
        .replace(/\n/g, '')
        .split(',')
        .map((origin) => origin.trim())
    : '*';

  app.enableCors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  CustomSwagger(app);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap().catch((error) => {
  console.error('Server not started, error:', error);
});
