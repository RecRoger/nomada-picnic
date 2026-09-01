import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-payment',
  imports: [TranslateModule, CurrencyPipe, DecimalPipe, LoaderComponent],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private bookingService = inject(BookingPicnicsService);

  readonly booking = this.cartService.booking;
  readonly totalAmount = this.cartService.totalAmount;

  readonly today = new Date();
  readonly tempBookingCode = `NP-${this.today.getFullYear()}-${(this.today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${this.today.getDate().toString().padStart(2, '0')}`;

  readonly paymentMethods = [
    'CREDIT',
    'DEBIT',
    'TRANSFER',
    'QUOTAS',
    'OTHER',
  ];

  public loadPayment = false

  public DOLLAR_VALUE = 1500

  async ngOnInit(): Promise<void> {
    await this.getDolar();
  }

  async onPay(partialPay = false): Promise<void> {
    this.loadPayment = true
    this.bookingService.saveBooking(partialPay).subscribe(resp => {
      console.log(resp)
      window.open(resp, '_blank');
      // window.location.href = resp;
    })
  }

  onBack(): void {
    this.router.navigate(['/checkout/form']);
  }

  async getDolar() {
    await fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(response => response.json())
      .then(data => {
        this.DOLLAR_VALUE = data.venta
      });
  }
}
