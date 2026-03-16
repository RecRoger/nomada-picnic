import { Routes } from '@angular/router';
import { PicnicCalculatorComponent } from '@pages/calculator-stepper/calculator-stepper.component';
import { PublicRoutes } from '@pages/public/public.routes';

export const routes: Routes = [
  ...PublicRoutes,
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.AdminRoutes),
  },
  { path: 'calculator', redirectTo: 'calculator/basics', pathMatch: 'full' },
  {
    path: 'calculator/:step',
    component: PicnicCalculatorComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];