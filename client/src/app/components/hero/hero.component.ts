import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [TranslateModule, MatIconModule, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input() nextSection: HTMLElement | undefined

  scrollToNext(element: HTMLElement) {
    element.scrollIntoView({
      behavior: 'smooth', // Hace que el scroll sea fluido
      block: 'start',
    });
  }
}
