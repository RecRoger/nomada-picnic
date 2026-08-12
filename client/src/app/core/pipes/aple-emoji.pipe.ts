import { Pipe, PipeTransform } from '@angular/core';
import twemoji from 'twemoji';

@Pipe({
  name: 'appleEmoji',
  standalone: true
})
export class AppleEmojiPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    return twemoji.parse(value, {
      folder: 'svg',
      ext: '.svg'
    });
  }
}