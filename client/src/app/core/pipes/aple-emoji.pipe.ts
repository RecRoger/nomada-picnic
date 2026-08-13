import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import twemoji from 'twemoji';

@Pipe({
  name: 'appleEmoji',
  standalone: true
})
export class AppleEmojiPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!value) return '';

    // 1. Generamos el HTML string con twemoji
    const parsedHtml = twemoji.parse(value, {
      folder: 'svg',
      ext: '.svg'
    });

    // 2. Le indicamos a Angular que confiamos en este HTML
    return this.sanitizer.bypassSecurityTrustHtml(parsedHtml);
  }
}