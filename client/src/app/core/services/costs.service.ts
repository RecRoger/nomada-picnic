import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, shareReplay, tap } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { IApiResponse, ICost } from '@shared/interfaces';
import { AlertTypes, CostsTypes } from '@shared/enums';
import { API_URL } from '@constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  private readonly http: HttpClient = inject(HttpClient)

  private readonly notificationService: NotificationService = inject(NotificationService)

  private typedCosts$: { [type: string]: Observable<ICost[]> } = {}

  private allAdditionalCosts$?: Observable<ICost[]>;

  /**
   * Snapshot sincrónico del último valor resuelto de getAllAdditionalCostsCached().
   * Permite a un componente inicializar su estado desde el constructor (antes de
   * que corra ngOnInit), evitando un render intermedio con la lista vacía cuando
   * el componente se recrea por navegación (ver AdditionalsComponent).
   */
  private allAdditionalCostsSnapshot: ICost[] | null = null;

  public getCostsCached(type: string): Observable<ICost[]> {
    if (!this.typedCosts$[type]) {
      this.typedCosts$[type] = this.getCosts(type).pipe(shareReplay(1))
    }
    return this.typedCosts$[type]
  }

  public getAllAdditionalCostsSnapshot(): ICost[] | null {
    return this.allAdditionalCostsSnapshot;
  }

  public getAllAdditionalCostsCached(): Observable<ICost[]> {
    if (!this.allAdditionalCosts$) {
      this.allAdditionalCosts$ = forkJoin([
        this.getCostsCached(CostsTypes.FURNITURE),
        this.getCostsCached(CostsTypes.DRINKS),
        this.getCostsCached(CostsTypes.ADDITIONAL),
        this.getCostsCached(CostsTypes.FOOD),
      ]).pipe(
        map(([furniture, drinks, additional, food]) => [...furniture, ...drinks, ...additional, ...food]),
        tap((list) => this.allAdditionalCostsSnapshot = list),
        shareReplay(1),
      );
    }
    return this.allAdditionalCosts$;
  }

  public getCosts(type?: string): Observable<ICost[]> {
    return this.http.get<IApiResponse<ICost[]>>(`${API_URL}/api/costs`, {
      params: { ...(type ? { type } : {}) }
    }).pipe(
      map((response) => {
        if (response) {
          return response.data as ICost[]
        }
        return []
      }),
      catchError((error) => {
        console.error('No se cargaron los costos:', error);
        this.notificationService.openNotification({ message: 'COSTS.ERROR' }, AlertTypes.ERROR)
        return of([]);
      })
    );
  }

  public getAdditionalById(costId: string, type: CostsTypes): Observable<ICost | undefined> {
    if (!costId || !type) return of(undefined);

    return this.getCostsCached(type).pipe(
      map((costs: ICost[]) => costs.find((cost) => cost._id === costId))
    );
  }

  public createCost(cost: FormData): Observable<ICost | null> {
    return this.http.post<IApiResponse<ICost>>(API_URL + '/api/costs', cost).pipe(
      map((response) => {
        if (response) {
          return response.data as ICost
        }
        return null
      }),
      catchError((error) => {
        console.error('No se creó el costo:', error);
        return of(null);
      })
    );
  }

  public editCost(id: string, cost: FormData): Observable<ICost | null> {
    return this.http.put<IApiResponse<ICost>>(`${API_URL}/api/costs/${id}`, cost).pipe(
      map((response) => {
        if (response) {
          return response.data as ICost
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
    return this.http.delete<IApiResponse<boolean>>(`${API_URL}/api/costs/${id}`).pipe(
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