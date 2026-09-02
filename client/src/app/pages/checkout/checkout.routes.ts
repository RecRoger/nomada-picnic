import { Routes } from '@angular/router';
import { CheckoutComponent } from '@pages/checkout/checkout.component';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { checkoutGuard } from 'src/app/core/guards/checkout.guard';
import { AdminComponent } from 'src/app/pages/admin/admin.component';

export const CheckoutRoutes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    children: [
      {
        path: '',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./components/checkout-preview/checkout-preview.component').then(c => c.CheckoutPreviewComponent)
      },
      {
        path: 'form',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./components/checkout-form/checkout-form.component').then(c => c.CheckoutFormComponent)
      },
      {
        path: 'payment',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./components/checkout-payment/checkout-payment.component').then(c => c.CheckoutPaymentComponent)
      },
      {
        path: 'confirmation',
        loadComponent: () => import('./components/checkout-confirmation/checkout-confirmation.component').then(c => c.CheckoutConfirmationComponent)
      },
    ]
  },
];