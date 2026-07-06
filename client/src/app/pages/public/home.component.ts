import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlacesCarouselComponent } from '@components/places-carousel/places-carousel.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { HeroComponent } from '@components/hero/hero.component';
import { FeaturesCardsComponent } from '@components/features-cards/features-cards.component';
import { PicnicsBannerComponent } from '@components/picnics-banner/picnics-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    PlacesCarouselComponent,
    RouterLink,
    HeroComponent,
    FeaturesCardsComponent,
    PicnicsBannerComponent,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public stepCards = [
    {
      step: 1,
      label: "PUBLIC.STEPS.FIRST"
    },
    {
      step: 2,
      label: "PUBLIC.STEPS.SECOND"
    },
    {
      step: 3,
      label: "PUBLIC.STEPS.THIRD"
    },
    {
      step: 4,
      label: "PUBLIC.STEPS.FORTH"
    },
    {
      step: 5,
      label: "PUBLIC.STEPS.FIFTH"
    },
  ]
}
