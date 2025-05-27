import { Routes } from '@angular/router';
import { AdminComponent } from '@pages/admin/admin.component';
import { PublicComponent } from '@pages/public/public.component';
import { LoginComponent } from '@components/login/login.component';
import { authGuard } from '@guards/auth.guard';
import { AdminPicnicsComponent } from '@admin-components/admin-picnics/admin-picnics.component';
import { AdminPlacesComponent } from '@admin-components/admin-places/admin-places.component';
import { AdminCostsComponent } from '@admin-components/admin-costs/admin-costs.component';
import { PicnicCalculatorComponent } from '@pages/calculator-stepper/calculator-stepper.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      { path: 'picnics', redirectTo: '', pathMatch: 'full' },
      { path: '', component: AdminPicnicsComponent },
      { path: 'places', component: AdminPlacesComponent },
      { path: 'costs', component: AdminCostsComponent }
    ]
  },
  { path: '', component: PublicComponent },
  { path: 'availability', component: PublicComponent },
  { path: 'picnics', redirectTo: 'picnics/basics', pathMatch: 'full' },
  {
    path: 'picnics/:step',
    component: PicnicCalculatorComponent,
  },
  { path: '*', redirectTo: '', pathMatch: 'full' }, // Ruta raíz redirige al módulo público
];
