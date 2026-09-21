import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-overlap-cards',
  imports: [TranslatePipe],
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
