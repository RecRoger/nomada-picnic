import { AfterViewInit, Component, ElementRef, inject, Input, NgZone, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web'; // La librería base de Lottie
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin de Scroll en GSAP
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-animation',
  imports: [],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss'
})
export class AnimationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  @Input() src = '';
  @Input() clickeable = false;
  @Input() autoplay = false;
  @Input() loop = false;
  @Input() scrollOptions: any | null = null;

  private animation?: AnimationItem;
  private scrollTween?: gsap.core.Tween;

  constructor(private ngZone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el src dinámicamente, reiniciamos la animación
    if (changes['src'] && !changes['src'].firstChange) {
      this.loadAnimation();
    }
  }

  ngAfterViewInit(): void {
    this.loadAnimation();
  }

  private loadAnimation(): void {
    if (this.animation) this.animation.destroy();

    // Ejecutamos fuera de Angular para mejorar performance
    this.ngZone.runOutsideAngular(() => {
      this.animation = lottie.loadAnimation({
        container: this.lottieContainer.nativeElement,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoplay,
        path: this.src
      });

      this.animation.addEventListener('DOMLoaded', () => {
        if (this.scrollOptions) {
          this.initScrollAnimation();
        }
      });
    });
  }

  private initScrollAnimation(): void {
    if (!this.animation) return;

    const playhead = { frame: 0 };

    // Matar animaciones previas si existen
    if (this.scrollTween) this.scrollTween.kill();
    if (this.scrollTween?.vars.scrollTrigger) {
      ScrollTrigger.getById('lottieTrigger')?.kill();
    }

    this.scrollTween = gsap.to(playhead, {
      frame: this.animation.totalFrames - 1,
      ease: this.scrollOptions?.ease || 'none',
      scrollTrigger: {
        id: 'lottieTrigger',
        trigger: this.scrollOptions?.trigger || this.lottieContainer.nativeElement,
        start: this.scrollOptions?.start || "top center",
        end: this.scrollOptions?.end || "bottom center",
        scrub: this.scrollOptions?.scrub ?? 1,
        markers: this.scrollOptions?.markers || false,
      },
      onUpdate: () => {
        // Usamos requestAnimationFrame implícito de GSAP para suavidad total
        this.animation?.goToAndStop(playhead.frame, true);
      }
    });
  }

  toggleAnimation(): void {
    if (this.clickeable && this.animation) {
      this.ngZone.run(() => { // Aquí sí volvemos a Angular si necesitas disparar eventos
        this.animation?.isPaused ? this.animation.play() : this.animation!.pause();
      });
    }
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.animation) this.animation.destroy();
      if (this.scrollTween) {
        this.scrollTween.kill();
        this.scrollTween.scrollTrigger?.kill();
      }
    });
  }
}