import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;

// En lugar de una flecha, usa una función declarativa y asegúrate 
// de que no haya NADA más ejecutándose en este archivo.
export default function () {
  return bootstrapApplication(AppComponent, config);
}