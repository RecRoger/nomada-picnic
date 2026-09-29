import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { IPackagePrice, IPicnicEvent, IPicnicPackage } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';
import { GuestsPricesComponent } from '@components/guests-prices/guests-prices.component';
import { EventSelectorComponent } from '@components/event-selector/event-selector.component';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CustomCurrencyPipe } from '@pipes/custom-currency.pipe';
import { CurrencySelectorComponent } from '@components/currency-selector/currency-selector.component';
import { CurrencyService } from '@services/currency.service';

@Component({
  selector: 'app-package-dialog',
  imports: [
    TranslatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    ApiImageUrlPipe,
    GuestsPricesComponent,
    EventSelectorComponent,
    CustomCurrencyPipe,
    AppleEmojiPipe,
    CurrencySelectorComponent,
  ],
  templateUrl: './package-dialog.component.html',
  styleUrl: './package-dialog.component.scss'
})
export class PackageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PackageDialogComponent>);

  private readonly currencyService = inject(CurrencyService);

  protected readonly isUsd = computed(() => this.currencyService.currentCurrency() === 'USD');

  public readonly recomendedTag = RECOMENDED_TAG

  readonly package = inject<IPicnicPackage>(MAT_DIALOG_DATA);

  public selectedPrice?: IPackagePrice;

  public selectedEvent?: IPicnicEvent;


  public selectPrice(group?: IPackagePrice): void {
    this.selectedPrice = group
  }

  public selectEvent(group?: IPicnicEvent): void {
    this.selectedEvent = group
  }
}
