import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlacesCarouselComponent } from '@components/places-carousel/places-carousel.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    PlacesCarouselComponent,
    RouterLink
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

  public infoCards = [
    {
      icon: "local_florist",
      label: "PUBLIC.RESUME.DECORATION"
    },
    {
      icon: "redeem",
      label: "PUBLIC.RESUME.INCLUDED"
    },
    {
      icon: "local_shipping",
      label: "PUBLIC.RESUME.PRODUCTION"
    },
    {
      icon: "bookmark_heart",
      label: "PUBLIC.RESUME.MEMORIES"
    },
  ]

  scrollToNext(element: HTMLElement) {
    element.scrollIntoView({
      behavior: 'smooth', // Hace que el scroll sea fluido
      block: 'start',
    });
  }
}
