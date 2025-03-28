import { Routes } from '@angular/router';
import { AdminComponent } from './sections/admin/admin.component';
import { PublicComponent } from './sections/public/public.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '', component: PublicComponent },
  { path: '*', redirectTo: '/public', pathMatch: 'full' }, // Ruta raíz redirige al módulo público
];
