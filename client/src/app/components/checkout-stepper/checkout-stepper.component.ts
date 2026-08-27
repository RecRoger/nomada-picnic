import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-checkout-stepper',
  imports: [TranslateModule, MatIconModule],
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss'
})
export class CheckoutStepperComponent {
  public stepsConfig = [
    { path: '', label: 'CHECKOUT.STEPPER.PREVIEW', status: 'done' },
    { path: 'form', label: 'CHECKOUT.STEPPER.FORM', status: 'active' },
    { path: 'payment', label: 'CHECKOUT.STEPPER.PAYMENT', status: '' },
    { path: 'confirmation', label: 'CHECKOUT.STEPPER.CONFIRMATION', status: '' },
  ]

  private router = inject(Router)

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  public activeStepIndex = computed(() => {
    const url = this.currentUrl();
    const segment = url.split('?')[0].split('/').pop() || '';
    const index = this.stepsConfig.findIndex((step) => step.path === segment);
    return index !== -1 ? index : 0;
  });

  // 3. Generar dinámicamente los pasos con su estado reactivo (done, active, pending)
  public steps = computed(() => {
    const currentIndex = this.activeStepIndex();

    return this.stepsConfig.map((step, index) => {
      let status: 'done' | 'active' | 'pending' = 'pending';

      if (index < currentIndex) {
        status = 'done';
      } else if (index === currentIndex) {
        status = 'active';
      }

      return {
        ...step,
        status,
        stepNumber: index + 1,
      };
    });
  });
}
