import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { TranslateModule } from '@ngx-translate/core';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ...TranslateModule.forRoot({
      defaultLanguage: 'es', // Idioma por defecto
    }).providers!,
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
