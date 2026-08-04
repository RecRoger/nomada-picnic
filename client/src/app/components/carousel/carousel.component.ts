import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, inject, Inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import Glide, { Options } from '@glidejs/glide';
import { afterNextRender } from '@angular/core';


export interface CarouselOptions {
  type?: 'slider' | 'carousel',
  perView?: number,
  gap?: number,
  breakpoints?: any,
  focusAt?: number | string,
  arrows?: boolean,
  dots?: boolean,
  counter?: boolean,
  autoplay?: number,
  peek?: number | string | Record<"before" | "after", number>,
  bound?: boolean,
  animationDuration?: number
  animationTimingFunc?: string
}
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  imports: [NgTemplateOutlet, MatIconModule],
})
export class CarouselComponent implements OnDestroy, OnChanges {
  protected platformId = inject(PLATFORM_ID);

  @ViewChild('glideRef', { static: false }) glideRef!: ElementRef;

  @Input() items: any[] = [];

  @Input() options: CarouselOptions = {};


  @ContentChild(TemplateRef) cardTemplate!: TemplateRef<any>;

  public currentSlide = 1

  public isBrowser = isPlatformBrowser(this.platformId);

  private glideInstance: any;

  private zone = inject(NgZone);

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => {
        this.initGlide();
      });
    }
  }

  private initGlide(): void {
    const options: Partial<Options> = {
      type: this.options.type ?? 'carousel',
      startAt: 0,
      perView: this.options.perView ?? 3,
      gap: this.options.gap ?? 24,
      autoplay: this.options.autoplay ?? undefined,
      peek: this.options.peek || 0,
      hoverpause: true,
      focusAt: this.options.focusAt ?? 0,
      breakpoints: this.options.breakpoints ?? {},
    }
    if (this.options.animationDuration) {
      options.animationDuration = this.options.animationDuration
    }
    if (this.options.animationTimingFunc) {
      options.animationTimingFunc = this.options.animationTimingFunc
    }

    this.zone.runOutsideAngular(() => {
      this.glideInstance = new Glide(this.glideRef.nativeElement, options);

      if (this.options.counter) {
        this.glideInstance.on(['mount.after', 'run.after'], () => {
          this.zone.run(() => {
            this.currentSlide = this.glideInstance.index + 1;
          });
        });
      }

      this.glideInstance.mount();
    })
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
}
