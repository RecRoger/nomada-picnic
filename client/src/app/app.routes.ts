import { Routes } from '@angular/router';
import { PublicRoutes } from '@pages/public/public.routes';

export const routes: Routes = [
  ...PublicRoutes,
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.AdminRoutes),
  },
  { path: 'calculator', redirectTo: 'calculator/basics', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];