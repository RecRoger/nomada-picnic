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
    focusAt: 'center',
    animationDuration: 2000,
    perView: 6.5,
    gap: 0,
    perspective: true,
    animationTimingFunc: 'linear',
    breakpoints: {
      1024: { perView: 6.5 },
      768: { perView: 5.5 },
      576: { perView: 4.5 } // Ideal para mobile
    }
  };
}
