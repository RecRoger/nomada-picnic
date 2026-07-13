import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, Inject, Input, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import Glide, { Options } from '@glidejs/glide';


export interface CarouselOptions {
  type?: 'slider' | 'carousel',
  perView?: number,
  gap?: number,
  breakpoints?: any,
  dots?: boolean,
  focusAt?: number | string,
  arrows?: boolean,
  autoplay?: number,
  animationDuration?: number
  animationTimingFunc?: string
  perspective?: boolean;
}
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  imports: [NgTemplateOutlet, MatIconModule],
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('glideRef', { static: false }) glideRef!: ElementRef;

  // Recibimos los datos del componente padre (ej. los productos adicionales)
  @Input() items: any[] = [];

  @Input() options: CarouselOptions = {};


  @ContentChild(TemplateRef) cardTemplate!: TemplateRef<any>;

  private glideInstance: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initGlide();
    }
  }

  private initGlide(): void {
    const options: Partial<Options> = {
      type: this.options.type ?? 'carousel',
      startAt: 0,
      perView: this.options.perView ?? 3,
      gap: this.options.gap ?? 24,
      autoplay: this.options.autoplay ?? undefined,
      hoverpause: true,
      // throttle: 5,
      focusAt: this.options.focusAt ?? 0,
      breakpoints: this.options.breakpoints ?? {},
    }
    if (this.options.animationDuration) {
      options.animationDuration = this.options.animationDuration
    }
    if (this.options.animationTimingFunc) {
      options.animationTimingFunc = this.options.animationTimingFunc
    }

    this.glideInstance = new Glide(this.glideRef.nativeElement, options);

    if (this.options.perspective) {
      const updatePerspective = () => this.calculatePerspective();
      this.glideInstance.on(['move', 'run.before', 'run.after'], updatePerspective);
      setTimeout(() => {
        this.calculatePerspective();
      }, 10);
    }

    this.glideInstance.mount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.glideInstance) {
      this.glideInstance.update()
    }
  }

  ngOnDestroy(): void {
    if (this.glideInstance) {
      this.glideInstance.destroy();
    }
  }

  private calculatePerspective(): void {
    const container = this.glideRef.nativeElement;
    if (!container) return;

    const cards = container.querySelectorAll('.story-photo-card');
    if (!cards.length) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    cards.forEach((card: any) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;

      const distanceFromCenter = Math.abs(containerCenter - cardCenter);
      const normalizedDistance = Math.min(distanceFromCenter / (containerRect.width / 2), 1.2);

      // --- Tus valores de escala y rotación actuales (se mantienen perfectos) ---
      const minScale = .9;
      const maxScale = 1.14;
      const targetScale = minScale + (maxScale - minScale) * normalizedDistance;

      const maxTranslateY = 16;
      const targetTranslateY = maxTranslateY * normalizedDistance;

      const isLeft = cardCenter < containerCenter;
      const maxRotation = 10;
      const targetRotation = maxRotation * normalizedDistance * (isLeft ? 1 : -1);

      // ==========================================================================
      // 💡 NUEVO CALCULO: SEPARACIÓN DINÁMICA (GAP SEPARADO EN EXTREMOS)
      // ==========================================================================
      // Definimos cuántos píxeles máximos queremos empujar las tarjetas exteriores hacia afuera.
      // Probá con 35px o subilo si necesitás que se separen todavía más.
      const maxGapPush = 45;

      // Al multiplicar por normalizedDistance, en el centro es 0 (no se mueve) 
      // y en los extremos se aplica el empuje máximo.
      let targetTranslateX = maxGapPush * normalizedDistance ^ 2;

      // Si la tarjeta está a la izquierda, la empujamos a la izquierda (negativo)
      // Si está a la derecha, la empujamos a la derecha (positivo)
      if (isLeft) {
        targetTranslateX = -targetTranslateX;
      }

      // ==========================================================================
      // APLICACIÓN DE ESTILOS ACTUALIZADA
      // ==========================================================================
      card.style.transformOrigin = 'center top';

      // 💡 Sumamos el translateX al string de transformaciones
      card.style.transform = `
        translateX(${targetTranslateX}px) 
        translateY(${targetTranslateY}px) 
        scale(${targetScale}) 
        rotateY(${targetRotation}deg)
      `;

      const targetBrightness = 1 - (0.1 * (1 - normalizedDistance));
      card.style.filter = `brightness(${targetBrightness})`;
    });
  }
}
