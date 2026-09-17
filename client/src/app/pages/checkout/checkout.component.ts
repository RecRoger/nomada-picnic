import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckoutStepperComponent } from '@components/checkout-stepper/checkout-stepper.component';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@services/analytics.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  imports: [TranslateModule, CheckoutStepperComponent, RouterOutlet],
})
export class CheckoutComponent implements OnInit {
  private analyticsService = inject(AnalyticsService)
  ngOnInit(): void {
    this.analyticsService.setNoIndex()
  }
}
