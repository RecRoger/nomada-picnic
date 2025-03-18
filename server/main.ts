import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.useStaticAssets(join(__dirname, '../..', 'client/dist/browser'));
  app.setBaseViewsDir(join(__dirname, '../..', 'client/dist/browser'));
  app.setViewEngine('html');

  await app.listen(port);
  console.log(`Application listening on port ${port}`);

}
bootstrap();
