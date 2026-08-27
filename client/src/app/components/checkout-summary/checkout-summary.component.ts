import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  @Output() onContinue: EventEmitter<void> = new EventEmitter()

  @Output() onBack: EventEmitter<void> = new EventEmitter()

  protected readonly cartService = inject(CartService);

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;
  readonly totalAmount = this.cartService.totalAmount;
}
