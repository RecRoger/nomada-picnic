import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ICost, IPicnicEvent } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CostsService } from '@services/costs.service';
import { forkJoin } from 'rxjs';
import { CostsTypes } from '@shared/enums';
import { CartService } from '@services/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recommended-dialog',
  imports: [
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    ApiImageUrlPipe,
    CurrencyPipe,
    AppleEmojiPipe,
    MatIconModule,
  ],
  templateUrl: './recommended-dialog.component.html',
  styleUrl: './recommended-dialog.component.scss'
})
export class RecommendedDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<RecommendedDialogComponent>);

  public readonly recomendedTag = RECOMENDED_TAG

  public recommendedList: ICost[] = []

  public addedCost: string[] = []

  readonly event = inject<IPicnicEvent>(MAT_DIALOG_DATA);

  private costService = inject(CostsService)

  private cartService = inject(CartService)

  ngOnInit(): void {
    this.getAdditionals()
  }

  public addAdditional(cost: ICost): void {
    if (!this.addedCost.includes(cost._id!)) {
      this.addedCost.push(cost._id!)
      this.cartService.addAdditional(cost, 1)
    }
  }

  private getAdditionals(): void {
    forkJoin([
      this.costService.getCostsCached(CostsTypes.FURNITURE),
      this.costService.getCostsCached(CostsTypes.DRINKS),
      this.costService.getCostsCached(CostsTypes.ADDITIONAL),
      this.costService.getCostsCached(CostsTypes.FOOD)
    ]).subscribe(([respFurniture, respDrinks, respAdditional, respFood]) => {
      const list = [...respFurniture, ...respDrinks, ...respAdditional, ...respFood]
      this.recommendedList = list.filter(cost => this.event.recomendedAditionals!.includes(cost._id!))
    })
  }
}
