import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingPicnicsService } from '@services/booking-picnics.service';
import { CartService } from '@services/cart.service';
import { NotificationService } from '@services/notification.service';
import { AlertTypes, PaymentMethods, PaymentTypes } from '@shared/enums';
import { MatRadioModule } from '@angular/material/radio';
import { catchError } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CustomCurrencyPipe } from '@pipes/custom-currency.pipe';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';
import { CurrencyService } from '@services/currency.service';

@Component({
  selector: 'app-checkout-payment',
  imports: [
    TranslatePipe,
    CustomCurrencyPipe,
    CurrencySelectorComponent,
    LoaderComponent,
    MatIconModule,
    MatExpansionModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    AppleEmojiPipe,
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
  private readonly currencyService = inject(CurrencyService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingPicnicsService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  readonly booking = this.cartService.booking;
  readonly totalAmount = this.cartService.totalAmount;

  public showErrorAlert = signal<boolean>(false)

  public errorId? = undefined

  readonly today = new Date();
  readonly tempBookingCode = `NP-${this.today.getFullYear()}-${(this.today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${this.today.getDate().toString().padStart(2, '0')}`;

  readonly PAYMENT_METHODS = PaymentMethods

  readonly PAYMENT_OPTIONS = PaymentTypes

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

  protected readonly isUsd = computed(() => this.currencyService.currentCurrency() === 'USD');
  protected readonly isArs = computed(() => this.currencyService.currentCurrency() === 'ARS');

  public loadPayment = false

  public form = this.fb.group({
    payMethod: ['', Validators.required],
    paymentOption: ['', Validators.required]
  })

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.checkParams()
  }

  public checkParams(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['error']) {
        this.showErrorAlert.set(true)
        this.errorId = params['picnicId']
      }
    })
  }

  public selectOption(option: string): void {
    this.form.get('paymentOption')?.setValue(option)
  }

  async onPay(): Promise<void> {
    if (this.form.valid) {
      this.loadPayment = true
      this.bookingService.saveBooking(
        this.form.get('payMethod')!.value as string,
        this.form.get('paymentOption')!.value as string,
        this.errorId
      ).pipe(catchError((err) => {
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
  }

  onBack(): void {
    this.router.navigate(['/checkout/form']);
  }
}
