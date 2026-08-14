import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '@services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CartDetailComponent } from '@components/cart-detail/cart-detail.component';
import { ICartAdditional } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    TranslateModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AppleEmojiPipe,
    CurrencyPipe,
    CartDetailComponent,
    ApiImageUrlPipe
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  protected cartService = inject(CartService)

  decreaseAdditional(additional: ICartAdditional) {
    if (additional.quantity > 1) {
      this.cartService.updateAdditionalQuantity(additional.cost._id!, additional.quantity - 1);
    } else {
      this.removeAdditional(additional);
    }
  }

  increaseAdditional(additional: ICartAdditional) {
    this.cartService.updateAdditionalQuantity(additional.cost._id!, additional.quantity + 1);
  }


  removeAdditional(additional: ICartAdditional) {
    this.cartService.removeAdditional(additional.cost._id!);
  }
}
