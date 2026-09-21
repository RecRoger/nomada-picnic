import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { CartService } from '@services/cart.service';
import { NotificationService } from '@services/notification.service';
import { AlertTypes, PaymentMethods } from '@shared/enums';
import { MatRadioModule } from '@angular/material/radio';
import { catchError } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-checkout-payment',
  imports: [
    TranslatePipe,
    CurrencyPipe,
    DecimalPipe,
    LoaderComponent,
    MatExpansionModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0px', opacity: 0, overflow: 'hidden' }),
        animate('250ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class CheckoutPaymentComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private bookingService = inject(BookingPicnicsService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  readonly booking = this.cartService.booking;
  readonly totalAmount = this.cartService.totalAmount;

  readonly today = new Date();
  readonly tempBookingCode = `NP-${this.today.getFullYear()}-${(this.today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${this.today.getDate().toString().padStart(2, '0')}`;

  readonly MP_PAYMENTH_METHODS = [
    'CREDIT',
    'DEBIT',
    'TRANSFER',
    'QUOTAS',
  ];

  readonly OTHER_PAYMENTH_METHODS = [
    'CASH_DOLLAR',
    'CASH_PESOS',
    'TRANSFER_DOLLAR',
    'TRANSFER_PESOS',
    'CRYPTO',
    'OTHER',
  ];

  public loadPayment = false

  public DOLLAR_VALUE = 1500

  public form = this.fb.group({
    payMethod: ['', Validators.required],
  })

  async ngOnInit(): Promise<void> {
    await this.getDolar();
  }

  async onPay(partialPay = false): Promise<void> {
    this.loadPayment = true
    this.bookingService.saveBooking(this.form.get('payMethod')!.value as string, partialPay).pipe(catchError((err) => {
      this.loadPayment = false
      this.notificationService.openNotification({ message: 'Ha ocurrido un error, intentelo nuevamente mas tarde' }, AlertTypes.ERROR)
      throw err
    })).subscribe(resp => {
      if (resp) {
        if (this.form.get('payMethod')!.value !== PaymentMethods.MP) {
          this.cartService.clearCart()
        }
        window.location.href = resp;
      }
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
