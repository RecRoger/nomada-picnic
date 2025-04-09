import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.dto';
import { CostDto } from '../models/cost.dto';
import { ALERT_TYPES } from '../enums/alert-types.enum';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  public getCosts(type?: string): Observable<CostDto[]> {
    return this.http.get<ApiResponse<CostDto[]>>(`/api/costs` + (type ? `/${type}` : '')).pipe(
      map((response) => {
        if (response) {
          return response.data as CostDto[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los costos:', error);
        this.notificationService.openNotification({ message: 'COSTS.ERROR' }, ALERT_TYPES.ERROR)
        return of([]);
      })
    );
  }

  public createCost(cost: FormData): Observable<CostDto | null> {
    return this.http.post<ApiResponse<CostDto>>('/api/costs', cost).pipe(
      map((response) => {
        if (response) {
          return response.data as CostDto
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el costo:', error);
        return of(null);
      })
    );
  }

  public editCost(id: string, cost: FormData): Observable<CostDto | null> {
    return this.http.put<ApiResponse<CostDto>>('/api/costs/' + id, cost).pipe(
      map((response) => {
        if (response) {
          return response.data as CostDto
        }
        return null
      }),
      catchError((error) => {
        console.error('No se editó el costo:', error);
        return of(null);
      })
    );
  }

  public deleteCost(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>('/api/costs/' + id).pipe(
      map((response) => {
        if (response) {
          return response.data as boolean
        }
        return false
      }),
      catchError((error) => {
        console.error('No se eliminó el costo:', error);
        return of(false);
      })
    );
  }
}