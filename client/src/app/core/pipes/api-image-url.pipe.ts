import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'apiImageUrl',
  standalone: true
})
export class ApiImageUrlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'assets/placeholder.png'; // Imagen por defecto
    return `${environment.apiUrl}${value}`;
  }
}