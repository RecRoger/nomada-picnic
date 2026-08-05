import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IPlace } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';

@Component({
  selector: 'app-place-dialog',
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule, MatIcon, ApiImageUrlPipe, SafeHtmlPipe],
  templateUrl: './place-dialog.component.html',
  styleUrl: './place-dialog.component.scss'
})
export class PlaceDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PlaceDialogComponent>);

  public readonly recomendedTag = RECOMENDED_TAG

  readonly place = inject<IPlace>(MAT_DIALOG_DATA);
}
