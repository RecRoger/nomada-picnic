import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { NavLink } from '@models/nav-link';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { filter, map, Observable } from 'rxjs';
import { CartService } from '@services/cart.service';
import { AnimationComponent } from '@components/animation/animation.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TranslateModule,
    RouterModule,
    RouterLink,
    MatIconModule,
    AsyncPipe,
    NgClass,
    AnimationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public openMenu = false

  protected readonly router = inject(Router)

  protected readonly cartService = inject(CartService)

  public isHome$: Observable<boolean> =
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        // Evaluamos si la URL actual es exactamente '/' o vacía
        return event.urlAfterRedirects === '/' || event.url === '/';
      })
    );

  public isScrolled = false

  public menuLinks: NavLink[] = [
    {
      link: '',
      label: 'PUBLIC.MENU.TABS.HOME',
      options: { exact: true }
    },
    {
      link: 'story',
      label: 'PUBLIC.MENU.TABS.STORY'
    },
    {
      link: 'picnics',
      label: 'PUBLIC.MENU.TABS.PICNICS'
    },
    {
      link: 'additionals',
      label: 'PUBLIC.MENU.TABS.ADDITIONALS'
    },
    {
      link: 'places',
      label: 'PUBLIC.MENU.TABS.PLACES'
    },
    {
      link: 'contact',
      label: 'PUBLIC.MENU.TABS.CONTACT'
    },
  ];

  public activeLinkIndex = 0

  private ngZone = inject(NgZone)

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollHeader();
    }
  }

  initScrollHeader() {
    // Ejecutamos fuera de la zona de Angular para máximo rendimiento
    this.ngZone.runOutsideAngular(() => {
      ScrollTrigger.create({
        start: 'top -50', // Se activa cuando scrolleamos 50px hacia abajo
        onUpdate: (self: any) => {
          // Volvemos a la zona de Angular solo para actualizar el booleano
          const scrolled = self.scroll() > 50;
          if (this.isScrolled !== scrolled) {
            this.ngZone.run(() => {
              this.isScrolled = scrolled;
            });
          }
        }
      });
    });
  }
}
