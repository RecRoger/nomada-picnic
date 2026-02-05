import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  // 1. CORS - Configurarlo desde el inicio evita dolores de cabeza
  app.enableCors({
    origin: [
      'http://localhost:4200', // Desarrollo Angular
      'https://nomadapicnic.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  // 2. Archivos Estáticos (Uploads)
  // Nota: Ahora 'uploads' debería estar dentro de 'api'
  const rootDir = process.cwd(); // Raíz del proyecto /api
  app.useStaticAssets(join(rootDir, 'uploads', 'places'), {
    prefix: '/uploads/places',
  });
  app.useStaticAssets(join(rootDir, 'uploads', 'costs'), {
    prefix: '/uploads/costs',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades de más
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );

  // 3. Swagger
  const config = new DocumentBuilder()
    .setTitle('Nómada Picnic API')
    .setDescription('Documentación de la API de reservas y logística')
    .setVersion('1.0')
    .addBearerAuth() // Útil si vas a usar JWT más adelante
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.log(`🚀 API lista en: http://localhost:${port}/docs`);
}
bootstrap();
