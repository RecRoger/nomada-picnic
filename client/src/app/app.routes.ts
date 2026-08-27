import { Routes } from '@angular/router';
import { PublicRoutes } from '@pages/public/public.routes';

export const routes: Routes = [
  ...PublicRoutes,
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.routes').then(m => m.CheckoutRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.AdminRoutes),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];