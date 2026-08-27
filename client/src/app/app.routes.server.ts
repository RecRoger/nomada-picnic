import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/**',
    renderMode: RenderMode.Client, // 👈 Se renderiza únicamente en el navegador del usuario
  },
  {
    path: 'checkout/**',
    renderMode: RenderMode.Client, // 👈 Se renderiza únicamente en el navegador del usuario
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender, // o RenderMode.Server
  },
];
