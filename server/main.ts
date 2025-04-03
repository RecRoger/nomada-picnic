import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  // Ruta base para acceder a los archivos desde el frontend
  const uploadDir = join(__dirname, '..', 'uploads', 'places')
  app.useStaticAssets(uploadDir, { prefix: '/uploads/places' });

  // Ruta cliente Angular
  app.useStaticAssets(join(__dirname, '../..', 'client/dist'));
  app.setBaseViewsDir(join(__dirname, '../..', 'client/dist'));
  app.setViewEngine('html');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Reservas')
    .setDescription('Documentación de la API de reservas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Expone Swagger UI en /api/docs

  await app.listen(port);
  console.log(`Application listening on port ${port}`);

}
bootstrap();
