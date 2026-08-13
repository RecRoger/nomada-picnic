import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-cart-detail',
  imports: [TranslateModule, MatIconModule, MatButtonModule],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent {
  protected readonly cartService = inject(CartService)
}
