import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { EventsService } from '@services/events.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-reviews-section',
  imports: [AsyncPipe, TranslatePipe, AppleEmojiPipe, MatIconModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss'
})
export class ReviewsSectionComponent {
  public readonly reviews$ = inject(EventsService).getReviews().pipe(map(
    list => [...list].sort(() => 0.5 - Math.random()).slice(0, 3)
  ))

  public getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
