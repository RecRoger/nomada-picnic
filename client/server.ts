
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node'; // <-- Nota el '/node'
import express from 'express';
import { join } from 'node:path';

export function app(): express.Express {
  const server = express();
  // Ajusta estas rutas según tu carpeta dist real de Nómada Picnic
  const serverDistFolder = join(process.cwd(), 'dist/client/server');
  const browserDistFolder = join(process.cwd(), 'dist/client/browser');
  // const indexHtml = join(serverDistFolder, 'index.server.html');

  const angularAppEngine = new AngularNodeAppEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // 1. Servir archivos estáticos PRIMERO, pero con una ruta específica o sin el '**'
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false, // Importante: que no intente servir index.html aquí
  }));

  // 2. Manejar todas las rutas de la App con el motor de Angular 19
  server.get('**', (req, res, next) => {
    angularAppEngine
      .handle(req) // El motor de v19 ya debería aceptar el req de Express si está bien configurado
      .then((response) => {
        if (response) {
          // Esta es la forma correcta y segura de v19 para devolver la respuesta a Express
          writeResponseToNodeResponse(response, res);
        } else {
          next();
        }
      })
      .catch(next);
  });


  return server;

}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();