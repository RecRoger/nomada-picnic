import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdditionalDialogComponent } from '@components/additional-dialog/additional-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { CostsService } from '@services/costs.service';
import { CostsTypes } from '@shared/enums';
import { ICartAdditional, ICost } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { normalizeString } from 'src/app/core/functions/search';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-additionals',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    ApiImageUrlPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './additionals.component.html',
  styleUrl: './additionals.component.scss'
})
export class AdditionalsComponent implements OnInit {
  protected readonly fb = inject(FormBuilder)

  protected readonly cartService = inject(CartService)

  public filteredList: ICost[] = []

  public filterForm = this.fb.group({
    keyword: '',
    costType: 'all',
    tags: [['']],
  })

  private costService = inject(CostsService)

  private additionalsList: ICost[] = []

  public typesList: string[] = [
    'all',
    CostsTypes.FURNITURE,
    CostsTypes.DRINKS,
    CostsTypes.ADDITIONAL,
    CostsTypes.FOOD,
  ];

  public tagList: string[] = [];

  readonly dialog = inject(MatDialog);

  private readonly destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.getAdditionals()
    this.setFilters();
  }

  public selectCategory(id: string): void {
    this.filterForm.get('costType')?.setValue(id || 'all');
  }

  public toggleTag(tag: string): void {
    const current: string[] = this.filterForm.get('tags')?.value || [];
    if (current.includes(tag)) {
      this.filterForm.get('tags')?.setValue(current.filter(t => t !== tag));
    } else {
      this.filterForm.get('tags')?.setValue([...current, tag]);
    }
  }

  public checkAdditional(additional: ICost): void {
    const dialogRef = this.dialog.open(AdditionalDialogComponent, {
      data: additional,
      width: '1000px',
      maxWidth: '90vw',
      height: 'auto',
      panelClass: 'nomada-additional-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const cartAdditionals = this.cartService.additionals()
        const cartItem = cartAdditionals.find((item: ICartAdditional) => item.cost._id === additional._id)
        if (cartItem) {
          if (additional.multipleAllowed) {
            this.cartService.updateAdditionalQuantity(additional._id!, cartItem.quantity + result)
          } else {
            this.cartService.openCart()
          }
        } else {
          this.cartService.addAdditional(additional, result)
        }
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
      const rawTags = this.additionalsList.flatMap(additional => additional.tags);
      this.tagList = Array.from(new Set(rawTags)) as string[];
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
    const typeValue: string = this.filterForm.get('costType')?.value || this.typesList[0]
    const keyValue: string = this.filterForm.get('keyword')?.value || ''
    const tagsValues: string[] = this.filterForm.get('tags')?.value || []

    if (!typeValue.length && !keyValue) {
      this.filteredList = this.additionalsList
    } else {
      if (typeValue != this.typesList[0]) {
        this.filteredList = this.additionalsList.filter(cost => cost.type == typeValue)
      } else {
        this.filteredList = this.additionalsList
      }
      if (keyValue.trim() != '') {
        const normalizedKey = normalizeString(keyValue)
        this.filteredList = this.filteredList.filter(cost => {
          const normalizedItem = normalizeString(cost.name);
          return normalizedItem.includes(normalizedKey);
        })
      }
    }
    const rawTags = this.filteredList.flatMap(additional => additional.tags);
    this.tagList = Array.from(new Set(rawTags)) as string[];

    if (tagsValues.length > 1) {
      const selectedTagsSet = new Set(tagsValues);
      this.filteredList = this.filteredList.filter(item =>
        item.tags && item.tags.some(tag => selectedTagsSet.has(tag))
      );
    }
  }
}
