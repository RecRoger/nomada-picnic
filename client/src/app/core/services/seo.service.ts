import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';

export interface SeoConfig {
  title?: string;
  description?: string;
  page?: string;
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private translateService = inject(TranslateService);

  public setNoIndex(): void {
    this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  public setSeoData(config: SeoConfig): void {
    const titleKey = `META.${config.page}.TITLE`;
    const descKey = `META.${config.page}.DESCRIPTION`;

    // get() espera a que las traducciones estén cargadas (incluso en SSR)
    combineLatest([
      this.translateService.get(titleKey),
      this.translateService.get(descKey),
    ]).subscribe(([translatedTitle, translatedDesc]) => {
      // Si por alguna razón falla la clave, usa el respaldo de config
      const finalTitle =
        translatedTitle && translatedTitle !== titleKey
          ? translatedTitle
          : config.title || '';

      const finalDesc =
        translatedDesc && translatedDesc !== descKey
          ? translatedDesc
          : config.description || '';

      const fullTitle = `${finalTitle} | Nómada Picnic`;
      const defaultImage = 'https://nomadapicnic.com/images/logos/NOMADA_METADATA.png';
      const currentUrl = config.url
        ? `https://nomadapicnic.com/${config.url}`
        : 'https://nomadapicnic.com';

      // 1. Título y Descripción Estándar
      this.title.setTitle(fullTitle);
      this.meta.updateTag({ name: 'description', content: finalDesc });

      // 2. Open Graph (Meta social)
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:title', content: fullTitle });
      this.meta.updateTag({ property: 'og:description', content: finalDesc });
      this.meta.updateTag({ property: 'og:image', content: config.image || defaultImage });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:url', content: currentUrl });
      this.meta.updateTag({ property: 'og:site_name', content: 'Nómada Picnic' });

      // 3. Twitter / X Cards
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
      this.meta.updateTag({ name: 'twitter:description', content: finalDesc });
      this.meta.updateTag({ name: 'twitter:image', content: config.image || defaultImage });
    });
  }
}
