import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CostDto } from '../../models/cost.dto';
import { CostsService } from '../../services/costs.service';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';


const MAT_MODULES = [
  MatTableModule, MatButtonModule, MatIconModule
]
@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [CommonModule, TranslateModule, ...MAT_MODULES],
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

  public costList: CostDto[] = [];

  columnsToDisplay = [
    "name",
    "type",
    "totalCost",
    "earnPercentage",
    "finalPrice",
  ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  expandedElements: string[] = []

  ngOnInit(): void {
    this.getCosts()
  }

  public getCosts(): void {
    this.costsService.getCosts().subscribe(costs => {
      console.log('cost', costs)
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

}
