import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgencyFormDialogComponent } from '@components/agency-form-dialog/agency-form-dialog.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { PackageDialogComponent } from '@components/package-dialog/package-dialog.component';
import { RecommendedDialogComponent } from '@components/recommended-dialog/recommended-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { AnalyticsService } from '@services/analytics.service';
import { CartService } from '@services/cart.service';
import { PackagesService } from '@services/packages.service';
import { SeoService } from '@services/seo.service';
import { IPackagePrice, IPicnicEvent, IPicnicPackage } from '@shared/interfaces';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { urlParameter } from 'src/app/core/functions/url-parameter';

@Component({
  selector: 'app-picnic-packages',
  imports: [
    AsyncPipe,
    TranslatePipe,
    MatIconModule,
    ApiImageUrlPipe,
    LoaderComponent,
    RouterLink
  ],
  templateUrl: './picnic-packages.component.html',
  styleUrl: './picnic-packages.component.scss'
})
export class PicnicPackagesComponent implements OnInit {
  protected readonly packageService = inject(PackagesService);
  protected readonly cartService = inject(CartService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  public packagesList: IPicnicPackage[] = []

  public packagesList$: Observable<IPicnicPackage[]> = this.packageService.getPackagesCached()
    .pipe(
      map(list => {
        this.packagesList = list
        return list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
      }),
      tap(_ => {
        this.checkPackageParam()
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  readonly dialog = inject(MatDialog);

  private readonly destroyRef = inject(DestroyRef)

  private readonly seoService = inject(SeoService);

  private readonly analyticsService = inject(AnalyticsService);

  private dialogRef: MatDialogRef<PackageDialogComponent> | null = null;

  ngOnInit(): void {
    this.seoService.setSeoData({
      url: 'picnics',
      page: 'PICNICS',
    })
  }

  public getItemUrl(name: string): string {
    return `/picnics/${urlParameter(name)}`
  }

  public checkPackageParam(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['name']) {
        const name = params['name'];
        const selectedPkg = this.packagesList.find(pkg => urlParameter(pkg.name) === name)
        if (selectedPkg) {
          this.openModal(selectedPkg);
        } else {
          this.router.navigate(['/picnics'], {
            state: { preventScrollTop: true }
          })
        }
      } else if (this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
      }
    });
  }

  public openModal(pkg?: IPicnicPackage): void {
    this.seoService.setSeoData({
      url: `picnics/${urlParameter(pkg?.name)}`,
      page: 'PACKAGES',
      title: `${pkg?.name} en Buenos Aires`,
      description: pkg?.meta || pkg?.description
    })
    this.analyticsService.viewItemEvent('package', pkg?.name || 'No name')
    this.dialogRef = this.dialog.open(PackageDialogComponent, {
      data: pkg,
      width: '1200px',
      maxWidth: '90vw',
      maxHeight: '85vh',
      autoFocus: false,
      restoreFocus: false,
    });

    this.dialogRef.afterClosed().subscribe(result => {
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

        this.analyticsService.addToCartEvent('package', pkg?.name || 'No name', {
          number_of_guests: group.maxGuests,
          price_total: group.price
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
      this.router.navigate(['/picnics'], {
        state: { preventScrollTop: true }
      })
      this.seoService.setSeoData({
        url: 'picnics',
        page: 'PICNICS',
      })
    });
  }

  public corpoContact() {
    this.dialog.open(AgencyFormDialogComponent, {
      autoFocus: false,
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
