import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IPlace } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';

@Component({
  selector: 'app-place-dialog',
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule, MatIcon, ApiImageUrlPipe, SafeHtmlPipe],
  templateUrl: './place-dialog.component.html',
  styleUrl: './place-dialog.component.scss'
})
export class PlaceDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PlaceDialogComponent>);

  readonly place = inject<IPlace>(MAT_DIALOG_DATA);
}
