import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselOptions } from '@components/carousel/carousel.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-story-banner',
  imports: [TranslateModule, CarouselComponent, RouterLink],
  templateUrl: './story-banner.component.html',
  styleUrl: './story-banner.component.scss'
})
export class StoryBannerComponent {
  historiasPics = [
    { url: '/images/picnics/photo_carrousel_home_0.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_1.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_2.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_3.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_4.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_5.jpg', alt: '' },
    { url: '/images/picnics/photo_carrousel_home_6.jpg', alt: '' },
  ];

  carouselOptions: CarouselOptions = {
    type: 'carousel',
    autoplay: 100,
    animationDuration: 2000,
    animationTimingFunc: 'linear',
    perView: 6.5,
    focusAt: 3,
    gap: 16,
    breakpoints: {
      1024: {
        perView: 6,
        focusAt: 4,
        gap: 16,
      },
      768: {
        perView: 4.5,
        focusAt: 2,
        gap: 16,
      },
      576: {
        perView: 2,
        focusAt: 1,
        gap: 20,
      }
    }
  };
}
