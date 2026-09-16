import { Routes } from '@angular/router';

export const BookingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking-form/booking-form.component').then(m => m.BookingFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./booking-detail/booking-detail.component').then(m => m.BookingDetailComponent),
  },
];