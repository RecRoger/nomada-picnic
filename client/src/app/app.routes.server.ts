import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'bookings/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'places/:name',
    renderMode: RenderMode.Server,
  },
  {
    path: 'picnics/:name',
    renderMode: RenderMode.Server,
  },
  {
    path: 'additionals/:name',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
