import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '@components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { PackagesService } from '@services/packages.service';
import { IPackagePrice } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-guests-prices',
  imports: [
    AsyncPipe,
    TranslateModule,
    MatIconModule,
    CurrencyPipe,
    LoaderComponent,
  ],
  templateUrl: './guests-prices.component.html',
  styleUrl: './guests-prices.component.scss'
})
export class GuestsPricesComponent {
  @Input() set packageId(id: string) {
    this.pricesGroups$ = this.packagesService.getPackagePricesCached(id || '')
  }

  @Output() selectPrice: EventEmitter<IPackagePrice> = new EventEmitter()

  protected readonly packagesService = inject(PackagesService)

  public pricesGroups$?: Observable<IPackagePrice[]>

  public selectedGroup?: IPackagePrice

  selectGroup(group: IPackagePrice) {
    if (!this.selectedGroup || this.selectedGroup !== group) {
      this.selectedGroup = group
    } else {
      this.selectedGroup = undefined
    }
    this.selectPrice.emit(this.selectedGroup)
  }
}
