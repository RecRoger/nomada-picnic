import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutSummaryComponent } from '@components/checkout-summary/checkout-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-preview',
  imports: [
    TranslateModule,
    CurrencyPipe,
    DatePipe,
    ApiImageUrlPipe,
    CheckoutSummaryComponent,
  ],
  templateUrl: './checkout-preview.component.html',
  styleUrl: './checkout-preview.component.scss'
})
export class CheckoutPreviewComponent {
  protected readonly cartService = inject(CartService);

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;

  private router = inject(Router);

  onEditSection(section: string) {
    switch (section) {
      case 'place':
        this.router.navigate(['/places']);
        break
      case 'additionals':
        this.router.navigate(['/additionals']);
        break
      case 'event':
      case 'datetime':
        this.cartService.openCart();
        this.cartService.showDetails();
        break
      case 'guests':
      default:
        this.router.navigate(['/picnics']);
        break
    }
  }

  onProceedToNextStep() {
    this.router.navigate(['/checkout/form']);
  }

  onBack() {
    this.router.navigate(['/picnics']);
  }
}
