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

    const parsedHtml = twemoji.parse(value, {
      base: 'images/graphics/',
      folder: 'emojis',
      ext: '.png',
    });

    return this.sanitizer.bypassSecurityTrustHtml(parsedHtml);
  }
}