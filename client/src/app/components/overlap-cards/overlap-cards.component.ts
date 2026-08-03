import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-overlap-cards',
  imports: [TranslateModule],
  templateUrl: './overlap-cards.component.html',
  styleUrl: './overlap-cards.component.scss'
})
export class OverlapCardsComponent {
  @Input() public cards: {
    imgSrc: string,
    title: string,
    label: string
  }[] = []
}
