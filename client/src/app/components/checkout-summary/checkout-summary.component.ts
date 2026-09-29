import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '@pipes/custom-currency.pipe';
import { CartService } from '@services/cart.service';


@Component({
  selector: 'app-checkout-summary',
  imports: [TranslatePipe, CustomCurrencyPipe, DatePipe],
  templateUrl: './checkout-summary.component.html',
  styleUrl: './checkout-summary.component.scss'
})
export class CheckoutSummaryComponent {

  @Input() form?: FormGroup

  @Output() onContinue: EventEmitter<void> = new EventEmitter()

  @Output() onBack: EventEmitter<void> = new EventEmitter()

  protected readonly cartService = inject(CartService);

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;
  readonly totalAmount = this.cartService.totalAmount;
}
