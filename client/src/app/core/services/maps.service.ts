import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  private readonly MAPS_KEY = 'AIzaSyDn5YTJHHUovnxgM0dmZAjpSAr95R-Hi0o';

  private scriptLoaded = false;

  public get mapReady(): boolean {
    return this.scriptLoaded
  }

  public get apiKey(): string {
    return this.MAPS_KEY
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  public load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        // Si está en el servidor, no hace nada
        resolve();
        return;
      }

      if (this.scriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      (window as any).initMap = () => { };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.MAPS_KEY}&libraries=places,marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

}