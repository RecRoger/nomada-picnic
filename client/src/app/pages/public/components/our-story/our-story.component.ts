import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OverlapCardsComponent } from '@components/overlap-cards/overlap-cards.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-our-story',
  imports: [TranslateModule, OverlapCardsComponent, RouterLink],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss'
})
export class OurStoryComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('textPathRef') textPathRefs!: QueryList<ElementRef<SVGTextPathElement>>;
  @ViewChildren('patternRef') patternRefs!: QueryList<ElementRef<SVGTSpanElement>>;


  public valuesCards = [
    {
      imgSrc: "emoji_story_leaves.png",
      title: 'PUBLIC.OUR_STORY.VALUES.CARDS.TITLE_1',
      label: "PUBLIC.OUR_STORY.VALUES.CARDS.SUBTITLE_1"
    },
    {
      imgSrc: "emoji_story_whiteheart.png",
      title: 'PUBLIC.OUR_STORY.VALUES.CARDS.TITLE_2',
      label: "PUBLIC.OUR_STORY.VALUES.CARDS.SUBTITLE_2"
    },
    {
      imgSrc: "emoji_home_why_sparkles_03.png",
      title: 'PUBLIC.OUR_STORY.VALUES.CARDS.TITLE_3',
      label: "PUBLIC.OUR_STORY.VALUES.CARDS.SUBTITLE_3"
    },
    {
      imgSrc: "emoji_story_planet.png",
      title: 'PUBLIC.OUR_STORY.VALUES.CARDS.TITLE_4',
      label: "PUBLIC.OUR_STORY.VALUES.CARDS.SUBTITLE_4"
    },
  ]

  private animationId!: number;
  private offset = 0;
  private patternLengths: number[] = [];
  public speed = 0.7;

  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSpeedByScreenSize();
      this.calculateLengths();
      this.animate();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSpeedByScreenSize();
    this.calculateLengths();
  }

  private updateSpeedByScreenSize(): void {
    const width = window.innerWidth;

    if (width <= 768) {
      this.speed = 2; // Mobile: Más rápido para compensar el espacio comprimido
    } else if (width <= 1024) {
      this.speed = 1.5; // Tablet: Velocidad intermedia
    } else {
      this.speed = 0.7; // Desktop: Velocidad base fluida
    }
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
