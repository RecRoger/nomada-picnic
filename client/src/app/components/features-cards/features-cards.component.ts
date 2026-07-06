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
      imgSrc: "emoji_home_why_art_01.png",
      title: 'PUBLIC.FEATURES.DECORATION.TITLE',
      label: "PUBLIC.FEATURES.DECORATION.TEXT"
    },
    {
      imgSrc: "emoji_home_why_check_02.png",
      title: "PUBLIC.FEATURES.INCLUDED.TITLE",
      label: "PUBLIC.FEATURES.INCLUDED.TEXT"
    },
    {
      imgSrc: "emoji_home_why_sparkles_03.png",
      title: "PUBLIC.FEATURES.PRODUCTION.TITLE",
      label: "PUBLIC.FEATURES.PRODUCTION.TEXT"
    },
    {
      imgSrc: "emoji_home_why_tree_04.png",
      title: "PUBLIC.FEATURES.MEMORIES.TITLE",
      label: "PUBLIC.FEATURES.MEMORIES.TEXT"
    },
  ]
}
