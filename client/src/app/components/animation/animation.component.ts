import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web'; // La librería base de Lottie
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin de Scroll en GSAP
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-animation',
  imports: [],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss'
})
export class AnimationComponent implements AfterViewInit, OnDestroy {

  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  @Input() src: string = ''

  @Input() clickeable: boolean = false

  @Input() autoplay: boolean = false

  @Input() loop: boolean = false

  @Input() scrollOptions: any = null

  private animation: AnimationItem | undefined; // Instancia de la animación de Lottie

  private tl: any;   // Timeline de GSAP

  constructor() { }

  ngAfterViewInit(): void {
    // 1. Cargar la animación de Lottie (Tu JSON)
    this.animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement, // Dónde renderizar
      renderer: 'svg',
      loop: this.loop, // Importante: 'false' para controlarlo con GSAP
      autoplay: this.autoplay, // Importante: 'false'
      path: this.src
    });

    if (this.scrollOptions) {
      // Esperar a que Lottie esté listo para obtener su duración total
      this.animation.addEventListener('DOMLoaded', () => {
        this.initScrollAnimation();
      });
    }
  }

  // INTERACCIÓN 1: Control por Scroll (GSAP ScrollTrigger)
  initScrollAnimation() {
    // 1. Creamos un objeto simple que GSAP SÍ puede animar
    const playhead = { frame: 0 };

    // 2. Vinculamos el scroll a este objeto
    gsap.to(playhead, {
      frame: this.animation!.totalFrames - 1, // Animamos hasta el último frame
      ease: this.scrollOptions.ease || 'none',
      scrollTrigger: {
        trigger: this.scrollOptions.triger || this.lottieContainer.nativeElement,
        start: this.scrollOptions.start,
        end: this.scrollOptions.end,
        scrub: 1, // Suavizado de 1 segundo
        markers: true
      },
      // 3. ¡LA CLAVE! En cada paso de la animación, actualizamos Lottie
      onUpdate: () => {
        this.animation!.goToAndStop(playhead.frame, true);
      }
    });
  }

  // INTERACCIÓN 2: Control por Clic (Ejemplo)
  toggleAnimation() {
    if (this.clickeable && !this.scrollOptions) {
      if (this.animation!.isPaused) {
        this.animation!.play();
      } else {
        this.animation!.pause();
      }

    }
  }

  // INTERACCIÓN 3: Cambio de Estado (Lógica de Angular)
  // Imagina un botón que cambia un booleano `estaReservado`
  actualizarPorEstado(estaReservado: boolean) {
    if (estaReservado) {
      // Ir a un frame específico de 'confirmación'
      this.animation!.goToAndStop(50, true); // Frame 50
    }
  }

  ngOnDestroy(): void {
    // Limpieza para evitar fugas de memoria
    if (this.animation) this.animation.destroy();
    if (this.tl) this.tl.kill();
  }
}