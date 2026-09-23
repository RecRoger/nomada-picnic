import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { PicnicPackageService } from 'src/modules/picnic-packages/picnic-packages.service';
import { PlacesService } from 'src/modules/places/places.service';
import { ProductionCostsService } from 'src/modules/production-costs/production-costs.service';

@Controller()
export class SitemapController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly costsService: ProductionCostsService,
    private readonly packagesService: PicnicPackageService,
  ) { }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Res() res: Response) {
    const baseUrl = 'https://nomadapicnic.com';

    // 1. Rutas estáticas principales de la app
    const staticRoutes = [
      { path: '', changefreq: 'weekly', priority: '1.0', comment: '<!-- Inicio / Home -->' },
      { path: '/picnics', changefreq: 'weekly', priority: '0.9', comment: '<!-- Experiencias y Paquetes (Página comercial clave) -->' },
      { path: '/places', changefreq: 'monthly', priority: '0.8', comment: '<!-- Lugares y Puntos de Encuentro -->' },
      { path: '/additionals', changefreq: 'monthly', priority: '0.8', comment: '<!-- Adicionales y Menú -->' },
      { path: '/story', changefreq: 'monthly', priority: '0.7', comment: '<!-- Nuestra Historia -->' },
      { path: '/contact', changefreq: 'monthly', priority: '0.6', comment: '<!-- Preguntas Frecuentes y Contacto -->' },
      { path: '/terms', changefreq: 'yearly', priority: '0.3', comment: '<!-- Términos y Condiciones -->' },
      { path: '/policy', changefreq: 'yearly', priority: '0.3', comment: '<!-- Políticas de Privacidad -->' },
    ];

    // 2. Obtener datos dinámicos desde MongoDB
    const places = await this.placesService.findAllActive();
    const additions = await this.costsService.findAllActive();
    const packages = await this.packagesService.findAllActive();

    // Helper para formatear slug si no está almacenado directamente
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    // 3. Generar las etiquetas <url>
    let urlsXml = '';

    // Rutas estáticas
    staticRoutes.forEach((route) => {
      urlsXml += `
        ${route.comment}
        <url>
          <loc>${baseUrl}${route.path}</loc>
          <changefreq>${route.changefreq}</changefreq>
          <priority>${route.priority}</priority>
        </url>`;
    });

    // Paquetes de picnics dinámicos si tienen URL propia

    urlsXml += '<!-- Paquetes de picnics -->';
    packages.forEach((pkg) => {
      const slug = slugify(pkg.name);
      urlsXml += `
        <url>
          <loc>${baseUrl}/picnics/${slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>`;
    });

    // Lugares dinámicos (/places/:slug)
    urlsXml += '<!-- Parques y Lugares publicos disponibles -->';
    places.forEach((place) => {
      const slug = slugify(place.name);
      urlsXml += `
      <url>
        <loc>${baseUrl}/places/${slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

    // Adicionales/Servicios dinámicos si tienen URL propia
    urlsXml += '<!-- Adicionales disponibles -->';
    additions.forEach((addition) => {
      const slug = slugify(addition.name);
      urlsXml += `
        <url>
          <loc>${baseUrl}/additionals/${slug}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>`;
    });

    // 4. Armar la estructura XML final
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlsXml}
      </urlset>`;

    // Enviar la respuesta XML
    res.send(sitemapXml.trim());
  }
}