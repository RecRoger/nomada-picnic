import { Routes } from '@angular/router';
import { PicnicCalculatorComponent } from '@pages/calculator-stepper/calculator-stepper.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/public/public.component').then(m => m.PublicComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.AdminRoutes),
  },
  { path: 'picnics', redirectTo: 'picnics/basics', pathMatch: 'full' },
  {
    path: 'picnics/:step',
    component: PicnicCalculatorComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];