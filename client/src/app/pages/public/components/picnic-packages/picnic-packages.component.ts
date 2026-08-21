import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AgencyFormDialogComponent } from '@components/agency-form-dialog/agency-form-dialog.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { PackageDialogComponent } from '@components/package-dialog/package-dialog.component';
import { RecommendedDialogComponent } from '@components/recommended-dialog copy/recommended-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { CartService } from '@services/cart.service';
import { PackagesService } from '@services/packages.service';
import { IPackagePrice, IPicnicEvent, IPicnicPackage } from '@shared/interfaces';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-picnic-packages',
  imports: [
    AsyncPipe,
    TranslateModule,
    MatIconModule,
    CurrencyPipe,
    ApiImageUrlPipe,
    LoaderComponent
  ],
  templateUrl: './picnic-packages.component.html',
  styleUrl: './picnic-packages.component.scss'
})
export class PicnicPackagesComponent {
  protected readonly packageService = inject(PackagesService);
  protected readonly cartService = inject(CartService);
  protected readonly router = inject(Router);

  public packagesList: IPicnicPackage[] = []

  public packagesList$: Observable<IPicnicPackage[]> = this.packageService.getPackagesCached()
    .pipe(map(list => {
      this.packagesList = list
      return list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
    }));

  readonly dialog = inject(MatDialog);

  public checkPackage(id: string): void {
    const pkg = this.packagesList.find(place => place._id === id)
    const dialogRef = this.dialog.open(PackageDialogComponent, {
      data: pkg,
      width: '1200px',
      maxWidth: '90vw',
      maxHeight: '85vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.group) {
        const group = result.group as IPackagePrice
        const event = result.event as IPicnicEvent
        this.cartService.updateBookingDetails({
          package: pkg,
          event,
          minGuests: group.minGuests,
          maxGuests: group.maxGuests,
          basePrice: group.price,
        })

        const dialogRef2 = this.dialog.open(RecommendedDialogComponent, {
          data: event,
          width: '700px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        });

        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            this.cartService.openCart()
          } else {
            this.router.navigate(['/additionals'])
          }
        })

      }
    });
  }

  public corpoContact() {
    const dialogRef = this.dialog.open(AgencyFormDialogComponent, {
      autoFocus: false,
      maxWidth: '90vw',
      maxHeight: '90vh',
    });




    // const message = `¡Hola! Me interesaria tener informacion sobre un los paquetes corporativos`;
    // const encodedMessage = encodeURIComponent(message);
    // const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
    // window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
