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
      title: 'PUBLIC.RESUME.DECORATION.TITLE',
      label: "PUBLIC.RESUME.DECORATION.TEXT"
    },
    {
      icon: "redeem",
      title: "PUBLIC.RESUME.INCLUDED.TITLE",
      label: "PUBLIC.RESUME.INCLUDED.TEXT"
    },
    {
      icon: "local_shipping",
      title: "PUBLIC.RESUME.PRODUCTION.TITLE",
      label: "PUBLIC.RESUME.PRODUCTION.TEXT"
    },
    {
      icon: "bookmark_heart",
      title: "PUBLIC.RESUME.MEMORIES.TITLE",
      label: "PUBLIC.RESUME.MEMORIES.TEXT"
    },
  ]
}
