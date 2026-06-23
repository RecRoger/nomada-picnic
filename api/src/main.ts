import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')

  // 1. CORS - Configurarlo desde el inicio evita dolores de cabeza
  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || '*',
      'http://localhost:4200', // Desarrollo Angular
      'https://nomadapicnic.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades de más
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );

  if (process.env.SHOW_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Nómada Picnic API')
      .setDescription('Documentación de la API de reservas y logística')
      .setVersion('1.0')
      // .addServer('https://nomada-backend-389141432152.us-east1.run.app')
      // .addBearerAuth() // Útil si vas a usar JWT más adelante
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log('✅ Swagger habilitado en: http://localhost:8080/docs');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API lista en: http://localhost:${port}/docs`);
}
bootstrap();
