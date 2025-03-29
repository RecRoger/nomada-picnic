import { Routes } from '@angular/router';
import { AdminComponent } from './sections/admin/admin.component';
import { PublicComponent } from './sections/public/public.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { PicnicsComponent } from './components/picnics/picnics.component';
import { PlacesComponent } from './components/places/places.component';
import { CostsComponent } from './components/costs/costs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'picnics', pathMatch: 'full' },
      { path: 'picnics', component: PicnicsComponent },
      { path: 'places', component: PlacesComponent },
      { path: 'costs', component: CostsComponent }
    ]
  },
  { path: '', component: PublicComponent },
  { path: '*', redirectTo: '/public', pathMatch: 'full' }, // Ruta raíz redirige al módulo público
];
