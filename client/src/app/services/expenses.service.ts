import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { ApiResponse } from '@models/api-response.dto';
import { ALERT_TYPES } from '@enums/alert-types.enum';
import { NotificationService } from '@services/notification.service';
import { ExpenseDto, ExpenseValueDto } from '@models/expense.dto';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private cachedExpenses$: Observable<ExpenseDto[]> = of([])

  public getExpensesCached(): Observable<ExpenseDto[]> {
    if (!this.cachedExpenses$) {
      this.cachedExpenses$ = this.getExpenses().pipe(shareReplay(1))
    }
    return this.cachedExpenses$
  }

  public getExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ApiResponse<ExpenseDto[]>>(`/api/expenses`).pipe(
      map((response) => {
        if (response) {
          return response.data as ExpenseDto[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los gastos:', error);
        this.notificationService.openNotification({ message: 'EXPENSES.ERROR' }, ALERT_TYPES.ERROR)
        return of([]);
      })
    );
  }

  public getExpensesValues(guests?: number, percentage?: number): Observable<ExpenseValueDto | null> {
    return this.http.get<ApiResponse<ExpenseValueDto>>(`/api/expenses/value`).pipe(
      map((response) => {
        if (response) {
          return response.data as ExpenseValueDto
        }
        return null
      }),
      catchError((error) => {
        console.error('No se cargaron los valores de gastos:', error);
        this.notificationService.openNotification({ message: 'EXPENSES.VALUE_ERROR' }, ALERT_TYPES.ERROR)
        return of(null);
      })
    );
  }

  public createExpense(expense: ExpenseDto): Observable<ExpenseDto | null> {
    return this.http.post<ApiResponse<ExpenseDto>>('/api/expenses', expense).pipe(
      map((response) => {
        if (response) {
          return response.data as ExpenseDto
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el gasto:', error);
        return of(null);
      })
    );
  }

  public editExpense(id: string, expense: ExpenseDto): Observable<ExpenseDto | null> {
    return this.http.put<ApiResponse<ExpenseDto>>('/api/expenses/' + id, expense).pipe(
      map((response) => {
        if (response) {
          return response.data as ExpenseDto
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
    return this.http.delete<ApiResponse<boolean>>('/api/expenses/' + id).pipe(
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