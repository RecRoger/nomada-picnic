import { Component, Input } from '@angular/core';
import { AnimationComponent } from '@components/animation/animation.component';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AnimationComponent],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() src = 'animations/nomada_cesta_azul.json'; // Ruta por defecto a tu Lottie JSON
  @Input() message = '';
  @Input() fullScreen = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}