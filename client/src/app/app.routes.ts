import { Routes } from '@angular/router';
import { AdminComponent } from './sections/admin/admin.component';
import { PublicComponent } from './sections/public/public.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminPicnicsComponent } from './components/admin-picnics/admin-picnics.component';
import { AdminPlacesComponent } from './components/admin-places/admin-places.component';
import { AdminCostsComponent } from './components/admin-costs/admin-costs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'picnics', pathMatch: 'full' },
      { path: 'picnics', component: AdminPicnicsComponent },
      { path: 'places', component: AdminPlacesComponent },
      { path: 'costs', component: AdminCostsComponent }
    ]
  },
  { path: '', component: PublicComponent },
  { path: '*', redirectTo: '/public', pathMatch: 'full' }, // Ruta raíz redirige al módulo público
];
