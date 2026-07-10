import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-additionals',
  imports: [CommonModule, TranslateModule, MatButtonModule, DecimalPipe, MatIconModule, ApiImageUrlPipe],
  templateUrl: './additionals.component.html',
  styleUrl: './additionals.component.scss'
})
export class AdditionalsComponent implements OnInit {

  public additionalsList: ICost[] = []

  private costService = inject(CostsService)

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getAdditionals()
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
    })
  }
}
