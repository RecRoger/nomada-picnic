import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '@services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CartDetailComponent } from '@components/cart-detail/cart-detail.component';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    TranslateModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AppleEmojiPipe,
    CurrencyPipe,
    CartDetailComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  protected cartService = inject(CartService)
}
