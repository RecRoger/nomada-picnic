import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ICost } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { CarouselComponent, CarouselOptions } from '@components/carousel/carousel.component';

@Component({
  selector: 'app-additional-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    ApiImageUrlPipe,
    SafeHtmlPipe,
    CarouselComponent,
  ],
  templateUrl: './additional-dialog.component.html',
  styleUrl: './additional-dialog.component.scss'
})
export class AdditionalDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AdditionalDialogComponent>);

  readonly additional = inject<ICost>(MAT_DIALOG_DATA);

  public max = 10
  public min = 1
  public count = 1

  public readonly carouselOptions: CarouselOptions = {
    type: 'slider',
    perView: 1,
    gap: 0,
    counter: true,
    arrows: true,
  }

  increes(): void {
    if (this.count < this.max) {
      this.count++;
    }
  }

  decrees(): void {
    if (this.count > this.min) {
      this.count--;
    }
  }
}
