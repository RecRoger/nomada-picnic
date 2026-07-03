import { NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { NavLink } from '@models/nav-link';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  public openMenu = false

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
      link: 'places',
      label: 'PUBLIC.MENU.TABS.PLACES'
    },
    {
      link: 'additionals',
      label: 'PUBLIC.MENU.TABS.ADDITIONALS'
    },
    {
      link: 'picnics',
      label: 'PUBLIC.MENU.TABS.PICNICS'
    },
    // {
    //   link: 'calculator',
    //   label: 'PUBLIC.MENU.TABS.CALCULATOR'
    // },
    {
      link: 'contact',
      label: 'PUBLIC.MENU.TABS.CONTACT'
    },
  ];

  public activeLinkIndex = 0

  private readonly router = inject(Router)

  private readonly authService = inject(AuthService)

  private ngZone = inject(NgZone)

  ngAfterViewInit() {
    this.initScrollHeader();
  }

  public get logged(): boolean {
    return this.authService.isAuthenticated()
  }

  public logout() {
    this.authService.logout()
    this.router.navigate(['/'])
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
