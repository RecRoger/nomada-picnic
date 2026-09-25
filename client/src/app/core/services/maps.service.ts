import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  private readonly MAPS_KEY = environment.mapsId;
  private platformId = inject(PLATFORM_ID);

  private scriptLoaded = false;
  private loadingPromise?: Promise<void>;

  public get mapReady(): boolean {
    return this.scriptLoaded;
  }

  public get apiKey(): string {
    return this.MAPS_KEY;
  }

  public load(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // 1. Establecemos las opciones globales de la API de Google Maps (se ejecuta 1 sola vez)
    setOptions({
      key: this.MAPS_KEY, // Ojo: en setOptions la propiedad es 'key', no 'apiKey'
      v: 'weekly',
    });

    // 2. Cargamos las librerías necesarias con 1 solo parámetro cada una
    this.loadingPromise = Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('marker'),
    ])
      .then(() => {
        this.scriptLoaded = true;
      })
      .catch((err) => {
        this.loadingPromise = undefined;
        console.error('Error al cargar la API de Google Maps:', err);
        throw err;
      });

    return this.loadingPromise;
  }

}