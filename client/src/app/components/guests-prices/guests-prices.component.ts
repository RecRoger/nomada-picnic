import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PackagesService } from '@services/packages.service';
import { IPackagePrice } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-guests-prices',
  imports: [AsyncPipe, TranslateModule, MatIconModule, DecimalPipe, CurrencyPipe],
  templateUrl: './guests-prices.component.html',
  styleUrl: './guests-prices.component.scss'
})
export class GuestsPricesComponent implements AfterViewInit {
  @Input() packageId?: string

  @Output() selectPrice: EventEmitter<IPackagePrice> = new EventEmitter()

  protected readonly packagesService = inject(PackagesService)

  public pricesGroups$?: Observable<IPackagePrice[]>

  public selectedGroup?: IPackagePrice

  ngAfterViewInit(): void {
    this.pricesGroups$ = this.packagesService.getPackagePricesCached(this.packageId || '')
  }

  selectGroup(group: IPackagePrice) {
    if (!this.selectedGroup || this.selectedGroup !== group) {
      this.selectedGroup = group
    } else {
      this.selectedGroup = undefined
    }
    this.selectPrice.emit(this.selectedGroup)
  }
}
