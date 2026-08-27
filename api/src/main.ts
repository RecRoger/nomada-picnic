import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')

  // 1. CORS - Configurarlo desde el inicio evita dolores de cabeza
  const allowedOrigins = [
    'https://nomada-client-389141432152.us-east1.run.app', // 👈 SIN LA BARRA DIAGONAL AL FINAL
    'https://nomadapicnic.com',
    'https://www.nomadapicnic.com'
  ];

  // Si la variable de entorno existe, le quitamos la barra final por seguridad y la sumamos al array
  if (process.env.CORS_ORIGIN) {
    const sanitizedOrigin = process.env.CORS_ORIGIN.replace(/\/$/, ""); // Remueve / si existe al final
    if (!allowedOrigins.includes(sanitizedOrigin)) {
      allowedOrigins.push(sanitizedOrigin);
    }
  }
  if (process.env.NODE_ENV == 'development') {
    allowedOrigins.push('http://localhost:4200');
  }
  app.enableCors({
    origin: allowedOrigins,
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
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log('✅ Swagger habilitado en: http://localhost:8080/docs');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API lista en: http://localhost:${port}/docs`);
}
bootstrap();
