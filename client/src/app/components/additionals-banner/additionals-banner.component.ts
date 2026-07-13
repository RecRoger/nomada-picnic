import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselOptions } from '@components/carousel/carousel.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { CostsService } from '@services/costs.service';
import { CostsTypes } from '@shared/enums';
import { ICost } from '@shared/interfaces';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-additionals-banner',
  imports: [
    TranslateModule,
    RouterLink,
    CarouselComponent,
    AsyncPipe,
    CurrencyPipe,
    ApiImageUrlPipe,
  ],
  templateUrl: './additionals-banner.component.html',
  styleUrl: './additionals-banner.component.scss'
})
export class AdditionalsBannerComponent implements AfterViewInit {

  public additionals$?: Observable<ICost[]>

  public popularTag = 'Mas vendido'

  public readonly carouselOptions: CarouselOptions = {
    perView: 1,
    gap: 24,
    dots: true,
    arrows: true,
    autoplay: 7000,
  }

  private costService = inject(CostsService)

  ngAfterViewInit(): void {
    this.getAdditionals()
  }

  private getAdditionals(): void {
    this.additionals$ = forkJoin([
      this.costService.getCostsCached(CostsTypes.FURNITURE),
      this.costService.getCostsCached(CostsTypes.ADDITIONAL),
      this.costService.getCostsCached(CostsTypes.FOOD)
    ]).pipe(map(([respFurniture, respAdditional, respFood]) => {
      const elementosMezclados = [...respFurniture, ...respAdditional, ...respFood].sort(() => Math.random() - 0.5)
      const seleccionadosConTag = elementosMezclados
        .filter(item => item.tags && item.tags.includes(this.popularTag))
        .slice(0, 2);
      const IDsSeleccionados = new Set(seleccionadosConTag.map(item => item._id));
      const remanentes = elementosMezclados.filter(item => !IDsSeleccionados.has(item._id));
      const cantidadFaltante = 5 - seleccionadosConTag.length;
      const seleccionadosRelleno = remanentes.slice(0, cantidadFaltante);
      return [...seleccionadosConTag, ...seleccionadosRelleno]
    }))
  }

}
