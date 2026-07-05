import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NavLink } from '@models/nav-link';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, RouterLink, AsyncPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  protected readonly router = inject(Router)

  public isAdmin$: Observable<boolean> =
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        return event.urlAfterRedirects.includes('/admin') || event.url.includes('/admin');
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
        href: 'tel:+5491126908781',
        label: 'PUBLIC.FOOTER.CONTACT.PHONE'
      },
      {
        href: 'mailto:contacto@nomadapicnic.com',
        label: 'PUBLIC.FOOTER.CONTACT.MAIL'
      },
      {
        href: 'https://instagram.com/nomadapicnic',
        label: 'PUBLIC.FOOTER.CONTACT.INSTAGRAM'
      },
    ],
    LEGAL: [
      {
        link: 'terms-and condition',
        label: 'PUBLIC.FOOTER.LEGAL.TYC'
      },
      {
        link: 'policy',
        label: 'PUBLIC.FOOTER.LEGAL.PP'
      },
      {
        href: 'https://wa.me/5491126908781',
        label: 'PUBLIC.FOOTER.LEGAL.PHONE_SUPERT'
      },
    ]
  }
}
