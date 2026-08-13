import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "@components/header/header.component";
import { MapsService } from '@services/maps.service';
import { FooterComponent } from '@components/footer/footer.component';
import { ShoppingCartComponent } from '@components/shopping-cart/shopping-cart.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '@services/cart.service';

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

  constructor(private mapsService: MapsService) {
    afterNextRender(() => {
      this.mapsService
        .load()
        ?.catch(err =>
          console.error('Error al cargar Google Maps', err)
        );
    });
  }

  ngOnInit(): void {
    this.translate.use('es');
  }

}
