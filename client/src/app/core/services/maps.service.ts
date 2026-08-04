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

  private loadingPromise?: Promise<void>

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

    this.loadingPromise = new Promise((resolve, reject) => {

      const script = document.createElement('script');

      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${this.MAPS_KEY}&v=weekly&libraries=places,marker&loading=async`;

      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = reject;

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

}