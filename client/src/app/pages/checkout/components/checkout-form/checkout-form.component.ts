import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutSummaryComponent } from '@components/checkout-summary/checkout-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-checkout-form',
  imports: [TranslateModule, ReactiveFormsModule, FormsModule, CheckoutSummaryComponent],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss'
})
export class CheckoutFormComponent {
  protected readonly cartService = inject(CartService);
  protected readonly fb = inject(FormBuilder)

  readonly booking = this.cartService.booking;
  readonly additionals = this.cartService.additionals;

  public form = this.fb.group({})

}
