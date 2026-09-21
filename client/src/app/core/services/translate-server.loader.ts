import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private prefix: string = 'dist/client/browser/i18n',
    private suffix: string = '.json'
  ) { }

  public getTranslation(lang: string): Observable<any> {
    try {
      // Leemos el JSON directamente del sistema de archivos en el contenedor
      const filePath = path.join(process.cwd(), this.prefix, `${lang}${this.suffix}`);
      const fileData = fs.readFileSync(filePath, 'utf8');
      return of(JSON.parse(fileData));
    } catch (error) {
      console.error(`❌ [SSR Error] No se pudo leer la traducción (${lang}) desde disco:`, error);
      return of({});
    }
  }
}