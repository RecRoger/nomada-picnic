import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ICost } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';

@Component({
  selector: 'app-additional-dialog',
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule, MatIcon, DecimalPipe, ApiImageUrlPipe],
  templateUrl: './additional-dialog.component.html',
  styleUrl: './additional-dialog.component.scss'
})
export class AdditionalDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AdditionalDialogComponent>);

  readonly additional = inject<ICost>(MAT_DIALOG_DATA);

  public count = 1

  public moveCounter(add = true): void {
    this.count = add ? this.count + 1 : this.count - 1
  }
}
