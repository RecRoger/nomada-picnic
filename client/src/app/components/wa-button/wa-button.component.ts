import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BUSINESS_NUMBER } from '@shared/const';

@Component({
  selector: 'app-wa-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './wa-button.component.html',
  styleUrl: './wa-button.component.scss'
})
export class WaButtonComponent {
  public contactUs(): void {
    let message = `¡Hola! Me gustaria tener mas informacion acerca de los picnics`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}