import { Routes } from '@angular/router';


export const PublicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
  },
  {
    path: 'places',
    loadComponent: () => import('./components/public-places/public-places.component').then(m => m.PublicPlacesComponent),
  },
  {
    path: 'additionals',
    loadComponent: () => import('./components/additionals/additionals.component').then(m => m.AdditionalsComponent),
  },
  {
    path: 'picnics',
    loadComponent: () => import('./components/picnic-combos/picnic-combos.component').then(m => m.PicnicCombosComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/public-contact/public-contact.component').then(m => m.PublicContactComponent),
  },
];