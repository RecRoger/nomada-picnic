import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-payment',
  imports: [TranslateModule, CurrencyPipe, DecimalPipe],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private bookingService = inject(BookingPicnicsService);

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

  public DOLLAR_VALUE = 1500

  async ngOnInit(): Promise<void> {
    await this.getDolar();
  }
  async onPay(): Promise<void> {
    this.bookingService.saveBooking().subscribe(resp => {
      window.open(resp, '_blank');
    })
  }

  onBack(): void {
    this.router.navigate(['/checkout/form']);
  }

  async getDolar() {
    // TODO - Refactorizar cambio de moneda
    await fetch('https://dolarapi.com/v1/dolares/blue')
      .then(response => response.json())
      .then(data => {
        this.DOLLAR_VALUE = data.venta
      });
  }
}
