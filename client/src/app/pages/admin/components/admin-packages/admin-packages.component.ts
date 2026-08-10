import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '@services/notification.service';
import { IPackagePrice, IPicnicPackage } from '@shared/interfaces';
import { AlertTypes, CostsTypes } from '@shared/enums';
import { CommonModule } from '@angular/common';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PackagesService } from '@services/packages.service';
import { PackagesFormComponent } from '@components/pacakges-form/packages-form.component';
import { Observable, take } from 'rxjs';


const MAT_MODULES = [
  MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatSelectModule, MatInputModule, MatFormFieldModule,
]
@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ...MAT_MODULES,
    PackagesFormComponent,
    ApiImageUrlPipe,
  ],
  templateUrl: './admin-packages.component.html',
  styleUrl: './admin-packages.component.scss',
  animations: [
    trigger('detailExpand',
      [
        state('collapsed,void', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
  ],
})
export class AdminPackagesComponent implements OnInit {
  private readonly packagesService: PackagesService = inject(PackagesService)

  private readonly translateService: TranslateService = inject(TranslateService)

  public readonly dialog = inject(MatDialog);

  private readonly notificationService: NotificationService = inject(NotificationService)

  public packageList: IPicnicPackage[] = [];

  public packagePrice$?: Observable<IPackagePrice[]>;

  public columnsToDisplayWithExpand = [
    "name",
    "guests",
    "baseCost",
    "expensesPercent",
    "profitPercent",
    "minPrice",
    'expand'
  ];

  public expandedElements: string[] = []

  public showForm?: boolean

  public packageToEdit?: IPicnicPackage

  public readonly costsTypes = Object.values(CostsTypes)

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.getPackages();
  }

  public getPackages(): void {
    this.packagesService.getPackages(false)
      .subscribe(packages => {
        this.packageList = packages
      })
  }

  /** Toggles the expanded state of an element. */
  public toggle(element: IPicnicPackage): void {
    if (this.expandedElements.includes(element._id || '')) {
      this.expandedElements = this.expandedElements.filter(exp => exp !== element._id)
      return
    }
    this.packagePrice$ = this.packagesService.getPackagePrices(element._id || '', false).pipe(take(1))
    this.expandedElements.push(element._id || '')
  }

  public savePackage(formPackage: IPicnicPackage) {
    const formData = this.appendForm(formPackage)
    const request = (this.packageToEdit)
      ? this.packagesService.editPackage(this.packageToEdit._id || '', formData)
      : this.packagesService.createPackage(formData)

    request.subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: this.packageToEdit ? 'PACKAGES.EDITED' : 'PACKAGES.ADDED' })
        this.getPackages()
        this.toggleEditForm()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  public toggleEditForm(pkg?: IPicnicPackage) {
    if (this.showForm) {
      this.showForm = undefined
      this.packageToEdit = undefined
    } else {
      this.expandedElements = []
      this.showForm = true
      this.packageToEdit = pkg
    }
  }

  public openDeleteDialog(pkg: IPicnicPackage): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translateService.instant('PACKAGES.DIALOG_TITLE'),
        text: this.translateService.instant('PACKAGES.DIALOG_TEXT', { name: pkg.name }),
        deny: this.translateService.instant('COMMON.CANCEL'),
        accept: this.translateService.instant('COMMON.DELETE'),
        id: pkg._id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.deletePackage(result)
      }
    });
  }

  private deletePackage(id: string): void {
    this.packagesService.deletePackage(id).subscribe(resp => {
      if (resp) {
        this.notificationService.openNotification({ message: 'PACKAGES.DELETED' })
        this.expandedElements = []
        this.getPackages()
      } else {
        this.notificationService.openNotification({ message: 'COMMON.GENERIC_ERROR' }, AlertTypes.ERROR)
      }
    })
  }

  private appendForm(packageForm: IPicnicPackage): FormData {
    const formData = new FormData();
    formData.append('name', packageForm.name)
    formData.append('description', packageForm.description + '')
    formData.append('detail', packageForm.detail + '')
    formData.append('tag', packageForm.tag + '')
    formData.append('extraTransport', packageForm.extraTransport + '')
    formData.append('includedItems', packageForm.includedItems?.join('|') as string)
    formData.append('minGuests', packageForm.minGuests + '')
    formData.append('maxGuests', packageForm.maxGuests + '')
    formData.append('profitPercent', packageForm.profitPercent + '')
    formData.append('expensesPercent', packageForm.expensesPercent + '')
    formData.append('productionCostIds', (packageForm.productionCostIds as string[]).join('|') + '')

    if (packageForm.image) {
      formData.append('image', packageForm.image);
    }
    return formData
  }
}
