import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    // Cargamos sus rutas hijas desde otro archivo para mayor limpieza
    // loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  // {
  //   path: '',
  //   loadComponent: () => import('./features/public/public.component').then(m => m.PublicComponent)
  // },
  // {
  //   path: 'picnics/:step',
  //   loadComponent: () => import('./features/calculator/picnic-calculator.component').then(m => m.PicnicCalculatorComponent),
  // },
  // Catch-all (404 o redirección)
  { path: '**', redirectTo: '', pathMatch: 'full' },
];