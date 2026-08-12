import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PackageDialogComponent } from '@components/package-dialog/package-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { PackagesService } from '@services/packages.service';
import { IPackagePrice, IPicnicEvent, IPicnicPackage } from '@shared/interfaces';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-picnic-packages',
  imports: [AsyncPipe, TranslateModule, MatIconModule, DecimalPipe, CurrencyPipe, ApiImageUrlPipe],
  templateUrl: './picnic-packages.component.html',
  styleUrl: './picnic-packages.component.scss'
})
export class PicnicPackagesComponent {
  protected readonly packageService = inject(PackagesService);

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
      panelClass: 'nomada-place-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.group) {
        // TODO - logica de selccion de paquete
        const group = result.group as IPackagePrice
        const event = result.event as IPicnicEvent
        const message = `¡Hola! Me interesaria tener informacion sobre un ${pkg!.name} de ${event.name} para ${group.minGuests} - ${group.maxGuests} personas (${group.price} US$)`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  public corpoContact() {
    const message = `¡Hola! Me interesaria tener informacion sobre un los paquetes corporativos`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${'5491126908781'}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
