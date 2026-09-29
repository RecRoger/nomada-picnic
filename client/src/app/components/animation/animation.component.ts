import { AfterViewInit, Component, effect, ElementRef, inject, Inject, input, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, signal, SimpleChanges, viewChild, ViewChild } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface ScrollOptions {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  ease?: string;
}

@Component({
  selector: 'app-animation',
  standalone: true,
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss'
})
export class AnimationComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly http = inject(HttpClient);

  readonly src = input.required<string>();
  readonly poster = input<string>('');
  readonly clickeable = input<boolean>(false);
  readonly autoplay = input<boolean>(false);
  readonly loop = input<boolean>(false);
  readonly scrollOptions = input<ScrollOptions | null>(null);

  readonly lottieContainer = viewChild.required<ElementRef<HTMLDivElement>>('lottieContainer');

  readonly isLoaded = signal<boolean>(false);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private animation?: AnimationItem;
  private scrollTween?: any;

  private static jsonCache = new Map<string, any>();

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const path = this.src();
        if (path) {
          this.loadAnimation(path);
        }
      });
    }
  }

  private async loadAnimation(path: string): Promise<void> {
    this.isLoaded.set(false);
    if (this.animation) this.animation.destroy();

    try {
      const jsonPromise = this.fetchAnimationData(path);
      const lottieModulePromise = import('lottie-web/build/player/lottie_light');

      const [animationData, lottieModule] = await Promise.all([jsonPromise, lottieModulePromise]);
      const lottie = lottieModule.default || lottieModule;

      this.ngZone.runOutsideAngular(() => {
        this.animation = lottie.loadAnimation({
          container: this.lottieContainer().nativeElement,
          renderer: 'svg',
          loop: this.loop(),
          autoplay: this.autoplay(),
          animationData
        });

        this.animation.addEventListener('DOMLoaded', () => {
          this.ngZone.run(() => this.isLoaded.set(true));
          if (this.scrollOptions()) {
            this.initScrollAnimation();
          }
        });
      });
    } catch (error) {
      console.error('Error al cargar la animación Lottie:', error);
    }
  }

  private async fetchAnimationData(path: string): Promise<any> {
    if (AnimationComponent.jsonCache.has(path)) {
      return AnimationComponent.jsonCache.get(path);
    }

    const data = await this.http.get(path).toPromise();
    AnimationComponent.jsonCache.set(path, data);
    return data;
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
    const opts = this.scrollOptions();

    if (this.scrollTween) this.scrollTween.kill();

    this.scrollTween = gsap.to(playhead, {
      frame: this.animation.totalFrames - 1,
      ease: opts?.ease || 'none',
      scrollTrigger: {
        id: 'lottieTrigger',
        trigger: opts?.trigger || this.lottieContainer().nativeElement,
        start: opts?.start || 'top center',
        end: opts?.end || 'bottom center',
        scrub: opts?.scrub ?? 1,
        markers: opts?.markers || false,
      },
      onUpdate: () => {
        this.animation?.goToAndStop(playhead.frame, true);
      }
    });
  }

  toggleAnimation(): void {
    if (this.clickeable() && this.animation) {
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