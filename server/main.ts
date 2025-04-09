import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  // Ruta base para acceder a los archivos desde el frontend
  const uploadPlacesDir = join(__dirname, '..', 'uploads', 'places')
  app.useStaticAssets(uploadPlacesDir, { prefix: '/uploads/places' });
  const uploadCostsDir = join(__dirname, '..', 'uploads', 'costs')
  app.useStaticAssets(uploadCostsDir, { prefix: '/uploads/costs' });

  // Ruta cliente Angular
  const appRoute = join(__dirname, '../..', 'client/dist', 'browser')
  console.log(appRoute)
  app.useStaticAssets(appRoute);
  app.setBaseViewsDir(appRoute);
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
