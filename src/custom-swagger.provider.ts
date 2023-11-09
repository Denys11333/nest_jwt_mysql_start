import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CustomSwagger = (app: INestApplication) => {
  const isProduction = new ConfigService().get('NODE_ENV') === 'PRODUCTION';

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Schedule')
      .setDescription('The schedule API description')
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
};
