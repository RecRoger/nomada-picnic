import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-payment',
  imports: [TranslateModule, CurrencyPipe],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly booking = this.cartService.booking;
  readonly totalAmount = this.cartService.totalAmount;

  // Identificador provisorio usando la fecha actual
  readonly today = new Date();
  readonly tempBookingCode = `NP-${this.today.getFullYear()}-${(this.today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${this.today.getDate().toString().padStart(2, '0')}`;

  // Métodos de pago informativos
  readonly paymentMethods = [
    'CREDIT',
    'DEBIT',
    'TRANSFER',
    'QUOTAS',
    'OTHER',
  ];

  onPay(): void {
    // TODO - Aquí disparas la petición a NestJS para generar el preferenceId de Mercado Pago
    console.log('Iniciando pago...');
  }

  onBack(): void {
    this.router.navigate(['/checkout/form']);
  }
}
