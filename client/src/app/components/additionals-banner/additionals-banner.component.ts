import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent } from '@components/carousel/carousel.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-additionals-banner',
  imports: [TranslateModule, RouterLink, CarouselComponent],
  templateUrl: './additionals-banner.component.html',
  styleUrl: './additionals-banner.component.scss'
})
export class AdditionalsBannerComponent {

  public readonly carouselOptions = {
    perView: 1, gap: 24
  }

  public additionals = [
    { id: 1, title: 'Box Mixto Pequeño', price: '60', desc: 'Una box diseñada para degustar bocados dulces y salados.', isBestSeller: true, img: 'assets/images/box-mixto.jpg' },
    { id: 2, title: 'Termo de Limonada', price: '15', desc: 'Limonada casera fría con menta y jengibre.', isBestSeller: false, img: 'assets/images/limonada.jpg' },
    { id: 3, title: 'Ramo de Flores', price: '25', desc: 'Flores de estación para ambientar y llevarte a casa.', isBestSeller: false, img: 'assets/images/flores.jpg' }
  ];

}
