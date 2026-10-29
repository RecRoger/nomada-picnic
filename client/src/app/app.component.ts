import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "@components/header/header.component";
import { FooterComponent } from '@components/footer/footer.component';
import { ShoppingCartComponent } from '@components/shopping-cart/shopping-cart.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '@services/cart.service';
import { AnalyticsService } from '@services/analytics.service';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    ShoppingCartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  protected cartService = inject(CartService);

  private translate = inject(TranslateService)

  private analyticsService = inject(AnalyticsService)

  private readonly router = inject(Router);

  private readonly viewportScroller = inject(ViewportScroller);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly destroyRef = inject(DestroyRef)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe(() => {
        const navigationState = history.state as { preventScrollTop?: boolean };
        if (navigationState?.preventScrollTop) {
          return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }

  ngOnInit(): void {
    this.translate.use('es');
    this.analyticsService.init();
  }

}

