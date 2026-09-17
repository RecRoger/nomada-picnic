import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private meta = inject(Meta);

  public setNoIndex(): void {
    this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
