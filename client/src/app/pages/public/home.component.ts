import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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
      block: 'start'
    });
  }
}
