import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { API_URL } from '@constants/api-url';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: true,
  allowedHosts: [
    'nomadapicnic.com',
    'www.nomadapicnic.com',
    'nomada-client-389141432152.us-east1.run.app',
  ],
});

app.set('trust proxy', true);

app.get('/sitemap.xml', async (req, res, next) => {
  // Construir URL de NestJS
  const apiBaseUrl = process.env['API_URL'] || 'https://nomada-backend-389141432152.us-east1.run.app/api';
  const targetUrl = `${apiBaseUrl.replace(/\/$/, '')}/sitemap.xml`;

  try {
    const response = await fetch(targetUrl, {
      headers: { 'Accept': 'application/xml' },
    });

    if (!response.ok) {
      throw new Error(`Error NestJS sitemap status: ${response.status}`);
    }

    const xmlContent = await response.text();

    // Importante: Limpiar cualquier encabezado previo y enviar como XML puro
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    // Con 'return res.send()' Express finaliza la respuesta y Angular SSR NO intervendrá
    return res.status(200).send(xmlContent.trim());

  } catch (error) {
    console.error(`Error obteniendo sitemap desde ${targetUrl}, buscando fallback...`, error);

    const possiblePaths = [
      join(browserDistFolder, 'sitemap.xml'),
      join(browserDistFolder, 'static_sitemap.xml'),
      join(process.cwd(), 'public', 'sitemap.xml'),
      join(process.cwd(), 'public', 'static_sitemap.xml'),
    ];

    const fallbackPath = possiblePaths.find((p) => existsSync(p));

    if (fallbackPath) {
      const fileContent = readFileSync(fallbackPath, 'utf-8');
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(fileContent.trim());
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(500).send(
      '<?xml version="1.0" encoding="UTF-8"?><error>Sitemap no disponible</error>'
    );
  }
});

/**
 * Servir archivos estáticos del browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Manejar todas las demás rutas con Angular SSR
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Iniciar el servidor si se ejecuta directamente
 */
const port = process.env['PORT'] || 4200;
if (isMainModule(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);