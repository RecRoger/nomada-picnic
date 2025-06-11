import { inject, Injectable } from '@angular/core';
import { BudgetData } from '@models/budget.dto';
import { CostDto } from '@models/cost.dto';
import { CostsService } from '@services/costs.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  public budgetPrice$ = new BehaviorSubject<number>(0)

  private costsService = inject(CostsService)

  private costsList: CostDto[] = []

  constructor() {
    this.getCosts();
  }

  get price$(): Observable<number> {
    return this.budgetPrice$.asObservable()
  }

  public checkPrice(value: BudgetData): void {
    console.log('I get the data', value)
    Math.random()
    this.budgetPrice$.next(Math.random() * 100)
  }

  private getCosts(): void {
    // TODO - retreaveCost 
  }
}                                   
