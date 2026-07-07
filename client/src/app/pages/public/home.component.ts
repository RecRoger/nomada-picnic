import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { HeroComponent } from '@components/hero/hero.component';
import { FeaturesCardsComponent } from '@components/features-cards/features-cards.component';
import { PicnicsBannerComponent } from '@components/picnics-banner/picnics-banner.component';
import { InfoStepsComponent } from '@components/info-steps/info-steps.component';
import { PlacesBannerComponent } from '@components/places-banner/places-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    HeroComponent,
    FeaturesCardsComponent,
    PicnicsBannerComponent,
    InfoStepsComponent,
    PlacesBannerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
