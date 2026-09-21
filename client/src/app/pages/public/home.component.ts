import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeroComponent } from '@components/hero/hero.component';
import { FeaturesCardsComponent } from '@components/features-cards/features-cards.component';
import { PicnicsBannerComponent } from '@components/picnics-banner/picnics-banner.component';
import { InfoStepsComponent } from '@components/info-steps/info-steps.component';
import { PlacesBannerComponent } from '@components/places-banner/places-banner.component';
import { AdditionalsBannerComponent } from '@components/additionals-banner/additionals-banner.component';
import { StoryBannerComponent } from '@components/story-banner/story-banner.component';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    HeroComponent,
    FeaturesCardsComponent,
    PicnicsBannerComponent,
    InfoStepsComponent,
    PlacesBannerComponent,
    AdditionalsBannerComponent,
    StoryBannerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: '',
      page: 'HOME',
    })
  }

}
