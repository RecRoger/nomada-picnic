import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckoutStepperComponent } from '@components/checkout-stepper/checkout-stepper.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  imports: [TranslateModule, CheckoutStepperComponent, RouterOutlet],
})
export class CheckoutComponent {

}
