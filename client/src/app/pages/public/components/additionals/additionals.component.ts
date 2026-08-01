import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdditionalDialogComponent } from '@components/additional-dialog/additional-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { CostsService } from '@services/costs.service';
import { CostsTypes } from '@shared/enums';
import { ICost } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { normalizeString } from 'src/app/core/functions/search';

@Component({
  selector: 'app-additionals',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    DecimalPipe,
    MatIconModule,
    ApiImageUrlPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './additionals.component.html',
  styleUrl: './additionals.component.scss'
})
export class AdditionalsComponent implements OnInit {
  protected readonly fb = inject(FormBuilder)

  public filteredList: ICost[] = []

  public filterForm = this.fb.group({
    keyword: [],
    tags: [],
    costType: []
  })

  private costService = inject(CostsService)

  private additionalsList: ICost[] = []

  readonly dialog = inject(MatDialog);

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.getAdditionals()
    this.setFilters();
  }

  public checkAdditional(additional: ICost): void {
    const dialogRef = this.dialog.open(AdditionalDialogComponent, {
      data: additional,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // TODO - logica de añadir adicional
        console.log("Añadir al carrito", result, additional._id)
      }
    });

  }

  private getAdditionals(): void {
    forkJoin([
      this.costService.getCostsCached(CostsTypes.FURNITURE),
      this.costService.getCostsCached(CostsTypes.DRINKS),
      this.costService.getCostsCached(CostsTypes.ADDITIONAL),
      this.costService.getCostsCached(CostsTypes.FOOD)
    ]).subscribe(([respFurniture, respDrinks, respAdditional, respFood]) => {
      this.additionalsList = [...respFurniture, ...respDrinks, ...respAdditional, ...respFood]
      this.filterCosts()
    })
  }

  private setFilters(): void {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => {
        this.filterCosts()
      })
  }

  private filterCosts(): void {
    const typeValue: string[] = this.filterForm.get('costType')?.value || []
    const keyValue: string = this.filterForm.get('keyword')?.value || ''

    if (!typeValue.length && !keyValue) {
      this.filteredList = this.additionalsList
    } else {
      if ((typeValue as string[]).length) {
        this.filteredList = this.additionalsList.filter(cost => (typeValue as string[]).includes(cost.type))
      }
      if (keyValue.trim() != '') {
        const normalizedKey = normalizeString(keyValue)
        this.filteredList = this.filteredList.filter(cost => {
          const normalizedItem = normalizeString(cost.name);
          return normalizedItem.includes(normalizedKey);
        })
      }
    }
  }
}
