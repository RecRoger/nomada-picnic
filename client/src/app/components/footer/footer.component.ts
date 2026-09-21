import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { WaButtonComponent } from '@components/wa-button/wa-button.component';
import { NavLink } from '@models/nav-link';
import { TranslatePipe } from '@ngx-translate/core';
import { BUSINESS_NUMBER } from '@shared/const';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe, RouterLink, AsyncPipe, WaButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  protected readonly router = inject(Router)

  protected readonly routeChange$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd))

  public isAdmin$: Observable<boolean> = this.routeChange$.pipe(
    map((event: NavigationEnd) => {
      return event.urlAfterRedirects.includes('/admin') || event.url.includes('/admin');
    })
  );
  public isCheckout$: Observable<boolean> = this.routeChange$.pipe(
    map((event: NavigationEnd) => {
      return event.urlAfterRedirects.includes('/checkout') || event.url.includes('/checkout');
    })
  );
  public isHome$: Observable<boolean> = this.routeChange$.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => {
      return event.urlAfterRedirects === '/' || event.url === '/';
    })
  );

  public linkFarm: { [key: string]: NavLink[] } = {
    EXPLORE: [
      {
        link: '/',
        label: 'PUBLIC.FOOTER.EXPLORE.HOME',
        options: { exact: true }
      },
      {
        link: 'picnics',
        label: 'PUBLIC.FOOTER.EXPLORE.PICNICS'
      },
      {
        link: 'additionals',
        label: 'PUBLIC.FOOTER.EXPLORE.ADDITIONALS'
      },
      {
        link: 'story',
        label: 'PUBLIC.FOOTER.EXPLORE.STORY'
      },
      {
        link: 'contact',
        label: 'PUBLIC.FOOTER.EXPLORE.CONTACT'
      },
    ],
    CONTACT: [
      {
        href: `tel:+${BUSINESS_NUMBER}`,
        label: 'COMMON.BUSINESS_PHONE'
      },
      {
        href: 'mailto:contacto@nomadapicnic.com',
        label: 'COMMON.BUSINESS_MAIL'
      },
      {
        href: 'https://instagram.com/nomadapicnic',
        label: 'PUBLIC.FOOTER.CONTACT.INSTAGRAM'
      },
    ],
    LEGAL: [
      {
        link: 'terms',
        label: 'PUBLIC.FOOTER.LEGAL.TYC'
      },
      {
        link: 'policy',
        label: 'PUBLIC.FOOTER.LEGAL.PP'
      },
      {
        href: `https://wa.me/${BUSINESS_NUMBER}`,
        label: 'PUBLIC.FOOTER.LEGAL.PHONE_SUPERT'
      },
    ]
  }
}
