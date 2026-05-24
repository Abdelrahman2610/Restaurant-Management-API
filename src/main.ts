import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Create a global pipe to validate all the upcoming requests:
  //This pipe will remove properties that are not inside the dto by throwing errors to the unknown
  // as well as transforms payloads to dto instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('Restaurant management system for  managinf restaurants , users and recommendations for restaurants.')
    .setVersion('1.0')
    .addTag('restaurants', 'Restaurant CDUD operations')
    .addTag('users', 'User management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
