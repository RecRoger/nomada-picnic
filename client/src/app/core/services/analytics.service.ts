import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

declare const gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly trackingId = 'G-VSG9GD7KPB';

  public init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadScripts();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', this.trackingId, {
          page_path: event.urlAfterRedirects,
        });
      });
  }

  private loadScripts(): void {
    const gScript = this.document.createElement('script');
    gScript.async = true;
    gScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    this.document.head.appendChild(gScript);

    const inlineScript = this.document.createElement('script');
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.trackingId}', { send_page_view: false });
    `;
    this.document.head.appendChild(inlineScript);
  }

  public logEvent(eventName: string, eventParams: Record<string, any> = {}): void {
    if (isPlatformBrowser(this.platformId) && typeof gtag === 'function') {
      gtag('event', eventName, eventParams);
    }
  }

  public viewItemEvent(item: 'package' | 'additional' | 'place', name: string): void {
    this.logEvent('view_item', {
      item_type: item,
      item_name: name
    });
  }

  public addToCartEvent(item: 'package' | 'additional' | 'place', name: string, params: Record<string, any> = {}): void {
    this.logEvent('view_item', {
      item_type: item,
      item_name: name,
      ...params
    });
  }
}
