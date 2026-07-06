import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-features-cards',
  imports: [TranslateModule, MatIconModule],
  templateUrl: './features-cards.component.html',
  styleUrl: './features-cards.component.scss'
})
export class FeaturesCardsComponent {
  public infoCards = [
    {
      icon: "local_florist",
      title: 'PUBLIC.FEATURES.DECORATION.TITLE',
      label: "PUBLIC.FEATURES.DECORATION.TEXT"
    },
    {
      icon: "redeem",
      title: "PUBLIC.FEATURES.INCLUDED.TITLE",
      label: "PUBLIC.FEATURES.INCLUDED.TEXT"
    },
    {
      icon: "local_shipping",
      title: "PUBLIC.FEATURES.PRODUCTION.TITLE",
      label: "PUBLIC.FEATURES.PRODUCTION.TEXT"
    },
    {
      icon: "bookmark_heart",
      title: "PUBLIC.FEATURES.MEMORIES.TITLE",
      label: "PUBLIC.FEATURES.MEMORIES.TEXT"
    },
  ]
}
