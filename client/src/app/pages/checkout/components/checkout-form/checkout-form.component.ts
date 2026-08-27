import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { CheckoutSummaryComponent } from '@components/checkout-summary/checkout-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';
import { IBookingClientInfo } from '@shared/interfaces';

@Component({
  selector: 'app-checkout-form',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    RouterLink,
    CheckoutSummaryComponent
  ],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss'
})
export class CheckoutFormComponent implements OnInit {
  protected readonly cartService = inject(CartService);
  protected readonly fb = inject(FormBuilder)

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;

  public form = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]+$/)]],
    honoredName: [''],
    comments: [''],
    requiredBill: [false],
    socialName: [''],
    cuit: [''],
    ivaCondition: [''],
    tyc: [false, [Validators.requiredTrue]],
    policy: [false, [Validators.requiredTrue]],
  })

  private readonly router = inject(Router)

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.checkValidators()
    if (this.cartService.clientForm()) {
      this.form.patchValue({ ...this.cartService.clientForm() })
    }
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  public onProceedToNextStep() {
    if (this.form.valid) {
      this.cartService.updateClientInfo(this.form.value as IBookingClientInfo)
      this.router.navigate(['/checkout/payment']);
    }
  }

  public onBack() {
    this.router.navigate(['/checkout']);
  }

  private checkValidators(): void {
    this.form.get('requiredBill')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => {
      if (val) {
        this.form.get('socialName')?.setValidators([Validators.required])
        this.form.get('ivaCondition')?.setValidators([Validators.required])
        this.form.get('cuit')?.setValidators([Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)])
      } else {
        this.form.get('socialName')?.setValidators([])
        this.form.get('ivaCondition')?.setValidators([])
        this.form.get('cuit')?.setValidators([])
        this.form.get('socialName')?.setValue(null)
        this.form.get('ivaCondition')?.setValue(null)
        this.form.get('cuit')?.setValue(null)

      }
    })
  }
}
