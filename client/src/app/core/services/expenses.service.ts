import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, IExpense, IExpenseValue } from '@shared/interfaces';
import { AlertTypes } from '@shared/enums';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private cachedExpense$: { [guests: string]: Observable<IExpenseValue> } = {}

  public getExpensesCached(guests: number): Observable<IExpenseValue> {
    if (!this.cachedExpense$[guests]) {
      this.cachedExpense$[guests] = this.getExpensesValues(guests).pipe(shareReplay(1))
    }
    return this.cachedExpense$[guests]
  }

  public getExpenses(): Observable<IExpense[]> {
    return this.http.get<IApiResponse<IExpense[]>>(`/api/expenses/list`).pipe(
      map((response) => {
        if (response) {
          return response.data as IExpense[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los gastos:', error);
        this.notificationService.openNotification({ message: 'EXPENSES.ERROR' }, AlertTypes.ERROR)
        return of([]);
      })
    );
  }

  public getExpensesValues(guests?: number, percentage?: number): Observable<IExpenseValue> {
    return this.http.get<IApiResponse<IExpenseValue>>(`/api/expenses`, {
      params: {
        ...(guests ? { guests } : {}),
        ...(percentage ? { percentage } : {})
      }
    }).pipe(
      map((response) => {
        if (response) {
          return response.data as IExpenseValue
        }
        return { totalValue: 0 }
      }),
      catchError((error) => {
        console.error('No se cargaron los valores de gastos:', error);
        this.notificationService.openNotification({ message: 'EXPENSES.VALUE_ERROR' }, AlertTypes.ERROR)
        return of({ totalValue: 0 });
      })
    );
  }

  public createExpense(expense: IExpense): Observable<IExpense | null> {
    return this.http.post<IApiResponse<IExpense>>('/api/expenses', expense).pipe(
      map((response) => {
        if (response) {
          return response.data as IExpense
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el gasto:', error);
        return of(null);
      })
    );
  }

  public editExpense(id: string, expense: IExpense): Observable<IExpense | null> {
    return this.http.put<IApiResponse<IExpense>>('/api/expenses/' + id, expense).pipe(
      map((response) => {
        if (response) {
          return response.data as IExpense
        }
        return null
      }),
      catchError((error) => {
        console.error('No se editó el gasto:', error);
        return of(null);
      })
    );
  }

  public deleteCost(id: string): Observable<boolean> {
    return this.http.delete<IApiResponse<boolean>>('/api/expenses/' + id).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se eliminó el gasto:', error);
        return of(false);
      })
    );
  }
}