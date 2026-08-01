import { afterNextRender, Component } from '@angular/core';
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
    autoplay: 3000,
    // animationDuration: 2000,
    animationTimingFunc: 'linear',
    perView: 3,
    focusAt: 1,
    peek: 200,
    gap: 46,
    breakpoints: {
      1024: {
        perView: 3,
        focusAt: 1,
        peek: 100,
        gap: 32,
      },
      768: {
        perView: 3,
        focusAt: 1,
        peek: 60,
        gap: 24,
      },
      576: {
        perView: 1,
        focusAt: 0,
        peek: 140,
        gap: 24,
      }
    }
  };
}
