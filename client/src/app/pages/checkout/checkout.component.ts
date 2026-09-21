import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckoutStepperComponent } from '@components/checkout-stepper/checkout-stepper.component';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  imports: [CheckoutStepperComponent, RouterOutlet],
})
export class CheckoutComponent implements OnInit {
  private seoService = inject(SeoService)
  ngOnInit(): void {
    this.seoService.setNoIndex()
  }
}
