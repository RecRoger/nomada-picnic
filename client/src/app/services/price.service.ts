import { Injectable } from '@angular/core';
import { BudgetData } from '@models/budget.dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  public budgetPrice$ = new BehaviorSubject<number>(0)

  constructor() { }

  get price$(): Observable<number> {
    return this.budgetPrice$.asObservable()
  }

  public checkPrice(value: BudgetData): void {
    console.log('I get the data', value)
    Math.random()
    this.budgetPrice$.next(Math.random() * 100)
  }
}
