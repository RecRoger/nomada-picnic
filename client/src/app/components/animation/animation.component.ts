import { AfterViewInit, Component, ElementRef, Inject, inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web'; // La librería base de Lottie
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-animation',
  standalone: true,
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss'
})
export class AnimationComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  @Input() src = '';
  @Input() clickeable = false;
  @Input() autoplay = false;
  @Input() loop = false;
  @Input() scrollOptions: any | null = null;

  private animation?: AnimationItem;
  private scrollTween?: any;
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && changes['src'] && !changes['src'].firstChange) {
      this.loadAnimation();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadAnimation();
    }
  }

  private async loadAnimation(): Promise<void> {
    if (!this.isBrowser || !this.src) return;

    if (this.animation) this.animation.destroy();

    // Importación dinámica para evitar que SSR procese las librerías del cliente
    const [lottieModule] = await Promise.all([
      import('lottie-web')
    ]);

    const lottie = lottieModule.default || lottieModule;

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

  private async initScrollAnimation(): Promise<void> {
    if (!this.animation || !this.isBrowser) return;

    const [gsapModule, scrollTriggerModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]);

    const gsap = gsapModule.default || gsapModule;
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

    gsap.registerPlugin(ScrollTrigger);

    const playhead = { frame: 0 };

    if (this.scrollTween) this.scrollTween.kill();

    this.scrollTween = gsap.to(playhead, {
      frame: this.animation.totalFrames - 1,
      ease: this.scrollOptions?.ease || 'none',
      scrollTrigger: {
        id: 'lottieTrigger',
        trigger: this.scrollOptions?.trigger || this.lottieContainer.nativeElement,
        start: this.scrollOptions?.start || 'top center',
        end: this.scrollOptions?.end || 'bottom center',
        scrub: this.scrollOptions?.scrub ?? 1,
        markers: this.scrollOptions?.markers || false,
      },
      onUpdate: () => {
        this.animation?.goToAndStop(playhead.frame, true);
      }
    });
  }

  toggleAnimation(): void {
    if (this.clickeable && this.animation) {
      this.ngZone.run(() => {
        this.animation?.isPaused ? this.animation.play() : this.animation!.pause();
      });
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      if (this.animation) this.animation.destroy();
      if (this.scrollTween) {
        this.scrollTween.kill();
        if (this.scrollTween.scrollTrigger) {
          this.scrollTween.scrollTrigger.kill();
        }
      }
    });
  }
}