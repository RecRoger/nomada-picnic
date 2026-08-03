import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-our-story',
  imports: [TranslateModule],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss'
})
export class OurStoryComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('textPathRef') textPathRefs!: QueryList<ElementRef<SVGTextPathElement>>;
  @ViewChildren('patternRef') patternRefs!: QueryList<ElementRef<SVGTSpanElement>>;

  private animationId!: number;
  private offset = 0;
  private patternLengths: number[] = [];
  public speed = 0.7;

  ngAfterViewInit(): void {
    this.calculateLengths();
    this.animate();
  }

  private calculateLengths(): void {
    if (this.patternRefs) {
      this.patternLengths = this.patternRefs.map(ref => {
        try {
          return ref.nativeElement.getComputedTextLength() || 0;
        } catch {
          return 0;
        }
      });
    }
  }

  private animate = (): void => {
    this.offset -= this.speed;
    if (this.textPathRefs) {
      this.textPathRefs.forEach((textPathRef, index) => {
        const patternLength = this.patternLengths[index] || 0;
        let currentOffset = this.offset;
        if (patternLength > 0) {
          currentOffset = this.offset % patternLength;
        }
        if (textPathRef?.nativeElement) {
          textPathRef.nativeElement.setAttribute('startOffset', `${currentOffset}px`);
        }
      });
    }
    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
