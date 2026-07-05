import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [TranslateModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input() nextSection: HTMLElement | undefined

  scrollToNext(element: HTMLElement) {
    // Definís cuántos píxeles querés dejar libres arriba (ej: tamaño de tu header + aire)
    const offset = 90;

    // Calculamos la posición absoluta del elemento restando el offset
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    // Ejecutamos el scroll suave nativo de la ventana
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
