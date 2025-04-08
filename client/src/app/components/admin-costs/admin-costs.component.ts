import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CostDto } from '../../models/cost.dto';
import { CostsService } from '../../services/costs.service';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CostsFormComponent } from '../costs-form/costs-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


const MAT_MODULES = [
  MatTableModule, MatButtonModule, MatIconModule
]
@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [CommonModule, TranslateModule, ...MAT_MODULES, CostsFormComponent],
  templateUrl: './admin-costs.component.html',
  styleUrl: './admin-costs.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminCostsComponent implements OnInit {
  private readonly costsService: CostsService = inject(CostsService)

  private readonly translateService: TranslateService = inject(TranslateService)

  public readonly dialog = inject(MatDialog);

  public costList: CostDto[] = [];

  public columnsToDisplayWithExpand = [
    "name",
    "type",
    "totalCost",
    "earnPercentage",
    "finalPrice",
    'expand'
  ];

  public expandedElements: string[] = []

  public showForm?: boolean

  public costToEdit?: CostDto

  ngOnInit(): void {
    this.getCosts()
  }

  public getCosts(): void {
    this.costsService.getCosts().subscribe(costs => {
      this.costList = costs
    })
  }

  /** Toggles the expanded state of an element. */
  public toggle(element: CostDto): void {
    if (this.expandedElements.includes(element._id || '')) {
      this.expandedElements = this.expandedElements.filter(exp => exp !== element._id)
      return
    }
    this.expandedElements.push(element._id || '')
  }

  public saveCost(formCost: CostDto) {
    const formData = this.appendForm(formCost)
    const request = (this.costToEdit)
      ? this.costsService.editCost(this.costToEdit._id || '', formData)
      : this.costsService.createCost(formData)

    request.subscribe(resp => {
      if (resp) {
        this.getCosts()
        this.toggleEditForm()
      }
    })
  }

  public toggleEditForm(cost?: CostDto) {
    if (this.showForm) {
      this.showForm = undefined
      this.costToEdit = undefined
    } else {
      this.expandedElements = []
      this.showForm = true
      this.costToEdit = cost
    }
  }

  public openDeleteDialog(cost: CostDto): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.translateService.instant('COSTS.DIALOG_TITLE'),
        text: this.translateService.instant('COSTS.DIALOG_TEXT', { name: cost.name }),
        deny: this.translateService.instant('COMMON.CANCEL'),
        accept: this.translateService.instant('COMMON.DELETE'),
        id: cost._id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.deleteCost(result)
      }
    });
  }

  private deleteCost(id: string): void {
    this.costsService.deleteCost(id).subscribe(resp => {
      if (resp) {
        this.expandedElements = []
        this.getCosts()
      }
    })
  }

  private appendForm(costForm: CostDto): FormData {
    const formData = new FormData();
    formData.append('name', costForm.name)
    formData.append('type', costForm.type)
    formData.append('description', costForm.description)
    formData.append('guestsCoverage', costForm.guestsCoverage + '')
    formData.append('providerCost', costForm.providerCost + '')
    formData.append('productionCost', costForm.productionCost + '')
    formData.append('earnPercentage', costForm.earnPercentage + '')

    // Añadir las imágenes a FormData    
    const images = costForm.images || []
    for (let i = 0; i < images?.length; i++) {
      formData.append('images', images[i]);
    }
    return formData
  }

}
