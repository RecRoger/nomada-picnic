import { Routes } from '@angular/router';


export const PublicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
  },
  {
    path: 'story',
    loadComponent: () => import('./components/our-story/our-story.component').then(m => m.OurStoryComponent),
  },
  {
    path: 'places',
    loadComponent: () => import('./components/places-map/places-map.component').then(m => m.PlacesMapComponent),
  },
  {
    path: 'additionals',
    loadComponent: () => import('./components/additionals/additionals.component').then(m => m.AdditionalsComponent),
  },
  {
    path: 'picnics',
    loadComponent: () => import('./components/picnic-packages/picnic-packages.component').then(m => m.PicnicPackagesComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/faq-contact/faq-contact.component').then(m => m.FAQContactComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/tyc/tyc.component').then(m => m.TycComponent),
  },
  {
    path: 'policy',
    loadComponent: () => import('./components/policy/policy.component').then(m => m.PolicyComponent),
  },
];