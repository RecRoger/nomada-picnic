import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IPackagePrice, IPicnicPackage } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';
import { GuestsPricesComponent } from '@components/guests-prices/guests-prices.component';

@Component({
  selector: 'app-package-dialog',
  imports: [
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    ApiImageUrlPipe,
    GuestsPricesComponent
  ],
  templateUrl: './package-dialog.component.html',
  styleUrl: './package-dialog.component.scss'
})
export class PackageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PackageDialogComponent>);

  public readonly recomendedTag = RECOMENDED_TAG

  readonly package = inject<IPicnicPackage>(MAT_DIALOG_DATA);

  public selectedPrice?: IPackagePrice

  public selectPrice(group?: IPackagePrice): void {
    this.selectedPrice = group
  }
}
