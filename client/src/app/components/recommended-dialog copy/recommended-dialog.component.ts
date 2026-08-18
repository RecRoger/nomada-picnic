import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ICost, IPicnicEvent } from '@shared/interfaces';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { RECOMENDED_TAG } from '@constants/important-tags';
import { AppleEmojiPipe } from '@pipes/aple-emoji.pipe';
import { CostsService } from '@services/costs.service';
import { forkJoin, tap } from 'rxjs';
import { CostsTypes } from '@shared/enums';
import { CartService } from '@services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '@components/loader/loader.component';

@Component({
  selector: 'app-recommended-dialog',
  imports: [
    AsyncPipe,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    ApiImageUrlPipe,
    CurrencyPipe,
    AppleEmojiPipe,
    MatIconModule,
    LoaderComponent,
  ],
  templateUrl: './recommended-dialog.component.html',
  styleUrl: './recommended-dialog.component.scss'
})
export class RecommendedDialogComponent {
  protected costService = inject(CostsService)

  readonly dialogRef = inject(MatDialogRef<RecommendedDialogComponent>);

  public readonly recomendedTag = RECOMENDED_TAG

  public recommendedList: ICost[] = []

  public addedCost: string[] = []

  public rocommended$ = forkJoin([
    this.costService.getCostsCached(CostsTypes.FURNITURE),
    this.costService.getCostsCached(CostsTypes.DRINKS),
    this.costService.getCostsCached(CostsTypes.ADDITIONAL),
    this.costService.getCostsCached(CostsTypes.FOOD)
  ]).pipe(tap(([respFurniture, respDrinks, respAdditional, respFood]) => {
    const list = [...respFurniture, ...respDrinks, ...respAdditional, ...respFood]
    this.recommendedList = list.filter(cost => this.event.recomendedAditionals!.includes(cost._id!))
  }))

  readonly event = inject<IPicnicEvent>(MAT_DIALOG_DATA);


  private cartService = inject(CartService)

  public addAdditional(cost: ICost): void {
    if (!this.addedCost.includes(cost._id!)) {
      this.addedCost.push(cost._id!)
      this.cartService.addAdditional(cost, 1)
    }
  }
}
