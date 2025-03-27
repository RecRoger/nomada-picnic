import { Routes } from '@angular/router';
import { AdminComponent } from './sections/admin/admin.component';
import { PublicComponent } from './sections/public/public.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: '', component: PublicComponent },
  { path: '*', redirectTo: '/public', pathMatch: 'full' }, // Ruta raíz redirige al módulo público
];
