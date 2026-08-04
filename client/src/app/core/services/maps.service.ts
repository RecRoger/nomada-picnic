import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  private readonly MAPS_KEY = 'AIzaSyB64dsMLc_CM0NGwz7o9gLmOd5MrOW7qeM';

  private scriptLoaded = false;

  public get mapReady(): boolean {
    return this.scriptLoaded
  }

  public get apiKey(): string {
    return this.MAPS_KEY
  }

  private platformId: any = inject(PLATFORM_ID)

  public load(): Promise<void> | null {
    if (isPlatformBrowser(this.platformId)) {
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.MAPS_KEY}&v=weekly&libraries=places,marker`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.scriptLoaded = true;
          resolve();
        };
        script.onerror = (error) => reject(error);

        document.head.appendChild(script);
      });
    } else {
      return null
    }
  }

}