import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations'; // <-- Importa esto
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideNoopAnimations(), // Esto evita que Material intente animar en el servidor
    provideServerRendering(),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);