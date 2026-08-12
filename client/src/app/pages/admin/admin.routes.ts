import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { AdminComponent } from 'src/app/pages/admin/admin.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      {
        path: 'places',
        loadComponent: () => import('./components/admin-places/admin-places.component').then(c => c.AdminPlacesComponent)
      },
      {
        path: 'costs',
        loadComponent: () => import('./components/admin-costs/admin-costs.component').then(c => c.AdminCostsComponent)
      },
      {
        path: 'packages',
        loadComponent: () => import('./components/admin-packages/admin-packages.component').then(c => c.AdminPackagesComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./components/admin-events/admin-events.component').then(c => c.AdminEventsComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./components/admin-expenses/admin-expenses.component').then(c => c.AdminExpensesComponent)
      },
      {
        path: 'picnics',
        loadComponent: () => import('./components/admin-picnics/admin-picnics.component').then(c => c.AdminPicnicsComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./../../components/login/login.component').then(m => m.LoginComponent)
  },
];