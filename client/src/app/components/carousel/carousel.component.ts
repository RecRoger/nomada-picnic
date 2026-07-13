import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, Inject, Input, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import Glide from '@glidejs/glide';


export interface CarouselOptions {
  type?: 'slider' | 'carousel',
  perView?: number,
  gap?: number,
  breakpoints?: any,
  dots?: boolean,
  arrows?: boolean,
  autoplay?: number,
  animationDuration?: number
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
    this.glideInstance = new Glide(this.glideRef.nativeElement, {
      type: this.options.type ?? 'carousel',
      startAt: 0,
      perView: this.options.perView ?? 3,
      gap: this.options.gap ?? 24,
      autoplay: this.options.autoplay ?? undefined,
      hoverpause: true,
      focusAt: 0,
      breakpoints: this.options.breakpoints ?? {},
    });

    if(this.options.animationDuration) {
      this.glideInstance.animationDuration = this.options.animationDuration
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
}
