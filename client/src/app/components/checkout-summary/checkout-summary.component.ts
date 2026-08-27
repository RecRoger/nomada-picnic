import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-summary',
  imports: [TranslateModule, CurrencyPipe, DatePipe],
  templateUrl: './checkout-summary.component.html',
  styleUrl: './checkout-summary.component.scss'
})
export class CheckoutSummaryComponent {

  @Input() form?: FormGroup

  protected readonly cartService = inject(CartService);

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;
  readonly totalAmount = this.cartService.totalAmount;

  private router = inject(Router);

  onProceedToNextStep() {
    this.router.navigate([
      this.form ? '/checkout/payment' : '/checkout/form'
    ]);
  }

  onBack() {
    this.router.navigate([
      this.form ? '/checkout' : '/picnics'
    ]);
  }
}
