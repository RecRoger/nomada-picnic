import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-our-story',
  imports: [MatIconModule],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss'
})
export class OurStoryComponent {
  @ViewChild('textPathRef') textPathRef!: ElementRef<SVGTextPathElement>;
  @ViewChild('patternRef') patternRef!: ElementRef<SVGTSpanElement>;

  private animationId!: number;
  private offset = 0;
  private patternLength = 0;
  public speed = .7; // 💡 Ajustá la velocidad (en px por frame)

  ngAfterViewInit(): void {
    // Calculamos el largo exacto del bloque repetido en px
    if (this.patternRef?.nativeElement) {
      this.patternLength = this.patternRef.nativeElement.getComputedTextLength();
    }

    this.animate();
  }

  private animate = (): void => {
    this.offset -= this.speed;

    // 💡 SI LLEGA AL LARGO EXACTO DEL PATRÓN, REINICIA A 0
    // Como el siguiente patrón es idéntico, el ojo no nota el salto
    if (Math.abs(this.offset) >= this.patternLength) {
      this.offset = 0;
    }

    if (this.textPathRef?.nativeElement) {
      this.textPathRef.nativeElement.setAttribute('startOffset', `${this.offset}px`);
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
