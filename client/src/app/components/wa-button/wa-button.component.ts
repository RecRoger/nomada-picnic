import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wa-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './wa-button.component.html',
  styleUrl: './wa-button.component.scss'
})
export class WaButtonComponent {
  public url = 'https://wa.me/5491126908781?text=Hola%20,%20quiero%20mas%20informacion%20sobre%20los%20picnic'

  public contactUs(): void {
    let message = `¡Hola! Me gustaria tener mas informacion acerca de los picnics`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}